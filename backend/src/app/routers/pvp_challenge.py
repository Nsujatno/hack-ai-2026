from fastapi import APIRouter, HTTPException
from app.database import get_supabase

router = APIRouter(prefix="/pvp-challenge", tags=["pvp"])

# The known input_hash for: topic=llm, skill_level=know_basics, goal=hobby,
# instructor_tone=fun_energetic, time_commitment=5_minutes
PVP_INPUT_HASH = "3b1638324cb7d661e8761a403ec01042"


@router.get("")
async def get_pvp_challenge():
    """Return the cached LLM lesson as a LessonData payload for the PvP challenge card."""
    db = get_supabase()

    res = db.table("lesson_cache").select("*").eq("input_hash", PVP_INPUT_HASH).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="PvP challenge lesson not found in cache")

    cached = res.data[0]

    lesson_plan: dict = cached.get("lesson_plan_json", {})
    video_url: str = cached.get("d_id_video_url") or cached.get("veo_video_url") or ""

    # Transform quiz questions into the LessonData shape the frontend expects
    quiz_data = lesson_plan.get("quiz", [])
    questions = []
    for idx, q in enumerate(quiz_data):
        correct_ans = q.get("correct_answer", "")
        options = [
            {
                "id": str(o_idx),
                "text": opt,
                "isCorrect": opt == correct_ans,
            }
            for o_idx, opt in enumerate(q.get("options", []))
        ]
        questions.append({
            "id": f"q{idx + 1}",
            "text": q.get("question", ""),
            "options": options,
            "explanation": f"Correct answer is: {correct_ans}",
        })

    return {
        "id": PVP_INPUT_HASH,
        "title": lesson_plan.get("title", "LLM Challenge"),
        "description": lesson_plan.get("description", ""),
        "duration": 60,
        "videoUrl": video_url,
        "questions": questions,
    }
