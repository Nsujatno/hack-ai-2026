# SkillDuel
An AI-powered micro-learning platform where users watch short AI-generated video lessons, take quizzes, and challenge friends to knowledge duels.

## What It Does

1. User completes a 5-step onboarding survey (topic, skill level, goal, tone, time commitment)
2. A LangGraph pipeline runs in the background:
   - Generates a structured lesson plan (title, description, 3 quiz questions) via Gemini
   - Generates a 6-lesson Duolingo-style learning path
   - Writes a 65–75 word voiceover script
   - Produces a talking-head video via D-ID Clips API with ElevenLabs TTS
   - Caches everything in Supabase so identical inputs return instantly
3. User lands on a dashboard with their lesson map, video player, quiz, and XP system
4. Users can challenge friends to the same lesson and compare scores

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Supabase Auth |
| Backend | FastAPI, Python 3.11, Uvicorn |
| AI Pipeline | LangGraph, Google Gemini 2.5 Flash Lite |
| Video Generation | D-ID Clips API + ElevenLabs TTS |
| Database | Supabase (PostgreSQL + Storage) |
| Validation | Pydantic v2, pydantic-settings |

---

## Architecture

```
POST /api/onboarding/survey       → saves survey to Supabase
POST /api/onboarding/generate-course → kicks off background LangGraph pipeline
GET  /api/onboarding/job/{id}     → poll job status
GET  /api/dashboard/{user_id}     → fetch generated lesson + learning path
GET  /api/pvp-challenge           → fetch shared PvP lesson from cache
```

### LangGraph Pipeline

```
check_cache → [HIT] → return cached result
           → [MISS] → generate_plan
                    → generate_learning_path
                    → generate_script
                    → generate_veo (D-ID video)
                    → save_cache
```
---

## Project Structure

```
backend/
  src/app/
    langgraph/
      nodes/
        cache_nodes.py      # Supabase cache read/write
        llm_nodes.py        # Gemini: lesson plan, script, learning path
        veo_nodes.py        # D-ID video generation + Supabase Storage upload
      graph.py              # LangGraph StateGraph definition
      state.py              # PipelineState TypedDict
    models/
      __init__.py           # Enums: SkillLevel, LearningGoal, InstructorTone, DailyCommitment
      onboarding.py         # Pydantic request/response models
    routers/
      onboarding.py         # Survey submit, generate-course, job polling
      dashboard.py          # Dashboard data assembly
      pvp_challenge.py      # PvP lesson endpoint
    config.py               # pydantic-settings env config
    database.py             # Supabase client (cached singleton)
    main.py                 # FastAPI app + CORS

frontend/
  app/
    survey/                 # 5-step onboarding flow
    building/               # Loading screen with job polling
    dashboard/              # Learning path map + lesson modal
    shop/                   # Avatar customization
    trophies/               # Badge system
  components/
    LessonModal.tsx         # Video player + quiz
    ChallengeInbox.tsx      # PvP challenge invites
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# create a .env file in backend/ with:
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# SUPABASE_ANON_KEY=...
# GEMINI_API_KEY=...
# DID_API_KEY=...          (optional — skips video generation if missing)
# ELEVENLABS_API_KEY=...   (optional)
# ELEVENLABS_VOICE_ID=...  

cd src
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

# create a .env.local file with:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```
