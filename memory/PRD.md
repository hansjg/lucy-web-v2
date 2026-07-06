# Lucy // Dexalab — Landing Page PRD

## Original Problem Statement
> Build a landing page about my product "Lucy" — an AI chatbot that combines TTS, STT,
> image recognition, and Local AI (own hardware). She is the first AI chatbot that
> combines usefulness with an interactive animated character (anime-style) with smooth
> emotional transitions and gesture animations. Domain: Dexalab.org.
>
> **2026-07 Redesign request (verbatim intent):** "reimagine the website, make it have
> stunning animations… immersive, award-winning, cinematic scrolling experience…
> weighted scrolling, and smooth entry animations."

## User Choices (verbatim)
- Original: Cyberpunk 2077 inspired theme, legally distinct.
- **Redesign (2026-07):** 3D Liquid / immersive aesthetic + let design expert decide;
  core message = "The future of AI companions is here" (awe) AND "Private, local AI
  that sees, hears and speaks" (trust); redesign AND restructure freely; audience =
  privacy-conscious + tech enthusiasts + general consumers.

## Personas
- Privacy-minded users who want zero cloud dependency.
- Builders / developers curious about a local-first AI companion.
- Tech enthusiasts / early adopters; general consumers.

## Current Design System (post-redesign v3, 2026-07)
- Premium dark: obsidian `#050505`, crimson `#D91636` (hover `#F01E42`), pearl `#FAFAFA`,
  lavender `#B9A2C2`, muted emotion palette (gold `#E8B44A`, sage `#8FA98F`)
- Fonts: Outfit (headings), Manrope (body), JetBrains Mono (labels)
- Surfaces: dark glassmorphism (`.glass`), subdued crimson/wine liquid blobs, noise
- Motion: Lenis weighted smooth scroll, framer-motion blur/rise entrances,
  sticky-scroll emotion section, scroll-linked word reveal, parallax massive footer type
- **Lucy Presenter**: chibi Lucy character (user-provided art) rigged as a fixed
  scroll-driven presenter — 6 pose sprites in `/app/frontend/public/lucy/`
  (base/wave/point/excited/shush/thumbs), IntersectionObserver section detection,
  per-section side/scale/pose/speech-bubble (typewriter), scroll-velocity tilt,
  hidden on mobile (static waving Lucy shown in hero instead)

## Implemented
### 2026-06 (v1 — cyberpunk HUD)
- Backend: `GET /api/`, `POST /api/waitlist` (EmailStr validation, case-insensitive
  duplicates, position counter), `GET /api/waitlist/count`; Mongo `waitlist` collection.
- v1 frontend (HUD/scanlines) — replaced by redesign.

### 2026-07 (v2 — full reimagining, TESTED 100%)
- `SmoothScroll.jsx` — Lenis weighted scrolling (lerp 0.09) + `scrollToId` helper
- `LiquidBackground.jsx` — 3 animated blurred blobs (cyan/magenta/violet) + noise + vignette
- `Header.jsx` — floating glass pill nav, gradient scroll-progress bar, smooth anchor nav
- `Hero.jsx` — staggered word-reveal H1 ("The future of AI companions is here."),
  looping animated chat demo (vision: "Accessing your camera…" → Raspberry Pi 5 →
  voice waveform), parallax + float, scroll cue
- `WaitlistForm.jsx` — shared glass pill form (hero + footer sources), position result
- `Capabilities.jsx` — bento grid (Vision 8-col w/ scan animation, Voice waveform,
  Local terminal, Emotion dots, Memory)
- `EmotionEngine.jsx` — 400vh sticky-scroll: morphing SVG face orb (joy/curiosity/
  surprise/calm), scroll-driven state changes, progress pills
- `PrivacyTrust.jsx` — scroll-linked word-by-word reveal of "Private, local AI that
  sees, hears and speaks." + metallic texture + 3 stat cards
- `FooterSection.jsx` — final CTA, FAQ accordion (6 items), massive parallax
  DEXALAB.ORG outline type, footer bar
- Deleted v1 components (SectionRail, HudFrame, Scanlines, Nav, Features, Emotions,
  Privacy, FaqSection, WaitlistCTA, Footer, ScrollProgress, Reveal)
- Fixed SVG `d=null` warning (initial d on motion.path)

### 2026-07 (v3 — premium dark theme + Lucy presenter, TESTED 100%)
- User feedback: cyan palette "cheap/toyish"; wanted darker premium + Lucy character
  presenting the site. Full palette swap to crimson/pearl/lavender on obsidian.
- Generated 6 consistent chibi pose sprites from user's Lucy art (green-screen
  generation + chroma key pipeline, point pose mirrored); stored in public/lucy/
- `LucyPresenter.jsx` — fixed scroll-rigged character layer: pose + side + speech
  bubble per section (hero→wave/right, capabilities→point/right, emotions→excited/left,
  privacy→shush/right, join→thumbs/left, faq→base/right), typewriter bubbles,
  scroll-velocity lean, spring position transitions
- Mobile: presenter hidden, static waving Lucy in hero (hero-lucy-mobile)
- Emotion palette muted: gold/lavender/crimson/sage; accent gradient for "AI companions"

## Testing
- iteration_1–4: v1 (pre-redesign)
- **iteration_5 (2026-07): v2 redesign — backend 9/9 pytest pass, frontend 100%**
- **iteration_6 (2026-07): v3 crimson theme + LucyPresenter — frontend 100%**
  (sprite loading/transparency, pose/side swaps all 6 sections, typewriter bubbles,
  waitlist forms, nav, emotion cycling, FAQ, mobile hidden presenter)

## Prioritized Backlog
### P1
- Referral / invite-a-friend logic on the waitlist
- SEO meta + Open Graph tags (`/app/frontend/public/index.html`)
- Mongo unique index on `waitlist.email` (race-safe duplicates)
- Real Dexalab social handles in footer
- Teaser video slot in hero

### P2 (when ready to publish)
- Email confirmation flow (double opt-in)
- Analytics opt-in; press kit / media section
- Live mini-demo strip (one message, cached response)

### P3 (post-launch)
- Live in-browser Lucy chat demo (limited), i18n, `/about` & `/team` pages

## Key Files
- Backend: `/app/backend/server.py`
- Page: `/app/frontend/src/pages/Landing.jsx`
- Sections: `/app/frontend/src/components/landing/{SmoothScroll,LiquidBackground,Header,Hero,WaitlistForm,Capabilities,EmotionEngine,PrivacyTrust,FooterSection}.jsx`
- API client: `/app/frontend/src/lib/lucyApi.js`
- Styles: `/app/frontend/src/index.css` · Tokens: `/app/design_guidelines.json`
