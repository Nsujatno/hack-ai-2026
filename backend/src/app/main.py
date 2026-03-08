from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import onboarding

app = FastAPI(
    title="SkillDuel API",
    description="Backend API for the SkillDuel peer-to-peer learning platform.",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Next.js dev server and any production domain
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from app.routers import dashboard, pvp_challenge

app.include_router(onboarding.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(pvp_challenge.router, prefix="/api")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["meta"])
async def health() -> dict:
    return {"status": "ok"}
