"""Backend tests for Lucy/Dexalab API.

Covers:
- Root GET /api/
- POST /api/waitlist (valid, duplicate, invalid email)
- GET /api/waitlist/count (reflects new submissions)
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://lucy-voice-vision.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_returns_lucy_message(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "Lucy" in data.get("message", "") and "Dexalab" in data.get("message", "")


# ---------- Waitlist count ----------
class TestWaitlistCount:
    def test_count_returns_int(self, session):
        r = session.get(f"{API}/waitlist/count")
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 0


# ---------- Waitlist POST ----------
class TestWaitlistPost:
    def test_create_valid_and_count_increments(self, session):
        # initial count
        c0 = session.get(f"{API}/waitlist/count").json()["count"]

        email = f"TEST_{uuid.uuid4().hex[:10]}@example.com"
        r = session.post(f"{API}/waitlist", json={"email": email, "source": "hero"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["already_registered"] is False
        assert isinstance(data["position"], int)
        assert data["position"] >= 1
        assert isinstance(data.get("message", ""), str) and len(data["message"]) > 0

        # count should have incremented by 1
        c1 = session.get(f"{API}/waitlist/count").json()["count"]
        assert c1 == c0 + 1

    def test_duplicate_email_returns_already_registered(self, session):
        email = f"TEST_dup_{uuid.uuid4().hex[:10]}@example.com"
        r1 = session.post(f"{API}/waitlist", json={"email": email})
        assert r1.status_code == 200
        d1 = r1.json()
        assert d1["already_registered"] is False
        pos1 = d1["position"]

        r2 = session.post(f"{API}/waitlist", json={"email": email})
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["already_registered"] is True
        assert d2["ok"] is True
        # position should be >= original position (total count)
        assert d2["position"] >= pos1

    def test_duplicate_with_different_case(self, session):
        email_lower = f"TEST_case_{uuid.uuid4().hex[:10]}@example.com"
        email_upper = email_lower.upper()
        r1 = session.post(f"{API}/waitlist", json={"email": email_lower})
        assert r1.status_code == 200
        assert r1.json()["already_registered"] is False

        r2 = session.post(f"{API}/waitlist", json={"email": email_upper})
        assert r2.status_code == 200
        # Backend lowercases — should detect duplicate
        assert r2.json()["already_registered"] is True

    def test_invalid_email_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={"email": "not-an-email"})
        assert r.status_code == 422

    def test_missing_email_returns_422(self, session):
        r = session.post(f"{API}/waitlist", json={})
        assert r.status_code == 422

    def test_source_optional_defaults(self, session):
        email = f"TEST_src_{uuid.uuid4().hex[:10]}@example.com"
        r = session.post(f"{API}/waitlist", json={"email": email})
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_footer_source_accepted(self, session):
        email = f"TEST_footer_{uuid.uuid4().hex[:10]}@example.com"
        r = session.post(f"{API}/waitlist", json={"email": email, "source": "footer"})
        assert r.status_code == 200
        assert r.json()["already_registered"] is False
