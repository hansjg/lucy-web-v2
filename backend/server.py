from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Lucy / Dexalab API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Status (existing) ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Lucy // Dexalab API online", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ---------- Waitlist ----------
class WaitlistCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = "hero"  # hero | footer | etc.


class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: str = "hero"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WaitlistResponse(BaseModel):
    ok: bool
    already_registered: bool
    position: int
    message: str


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate):
    email = payload.email.lower().strip()

    existing = await db.waitlist.find_one({"email": email}, {"_id": 0})
    if existing:
        # compute position
        total = await db.waitlist.count_documents({})
        return WaitlistResponse(
            ok=True,
            already_registered=True,
            position=total,
            message="You're already on the list. Stand by for neural link sync.",
        )

    entry = WaitlistEntry(email=email, source=payload.source or "hero")
    doc = entry.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.waitlist.insert_one(doc)

    total = await db.waitlist.count_documents({})
    return WaitlistResponse(
        ok=True,
        already_registered=False,
        position=total,
        message="Access requested. Lucy will reach out when the gate opens.",
    )


@api_router.get("/waitlist/count")
async def waitlist_count():
    total = await db.waitlist.count_documents({})
    return {"count": total}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
