import uuid

from fastapi import APIRouter, HTTPException

from app.database import get_supabase
from app.models.onboarding import SurveyResponse, SurveySubmission

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("/survey", response_model=SurveyResponse, status_code=201)
async def submit_survey(payload: SurveySubmission) -> SurveyResponse:
    """
    Save the onboarding survey responses to Supabase.

    All five questions are validated by Pydantic before hitting this handler.
    The row is inserted into the `onboarding_surveys` table and the created
    record is returned to the caller so the frontend has the survey_id for
    any follow-up requests (e.g. triggering the LangGraph pipeline).
    """
    db = get_supabase()

    row = {
        "id": str(uuid.uuid4()),
        "user_id": payload.user_id,
        "topic": payload.topic,
        "skill_level": payload.skill_level.value,
        "learning_goal": payload.learning_goal.value,
        "instructor_tone": payload.instructor_tone.value,
        "daily_commitment": payload.daily_commitment.value,
    }

    try:
        result = db.table("onboarding_surveys").insert(row).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save survey: {exc}",
        ) from exc

    saved = result.data[0] if result.data else row

    return SurveyResponse(
        survey_id=saved["id"],
        user_id=saved.get("user_id"),
        topic=saved["topic"],
        skill_level=saved["skill_level"],
        learning_goal=saved["learning_goal"],
        instructor_tone=saved["instructor_tone"],
        daily_commitment=saved["daily_commitment"],
    )


@router.get("/survey/questions")
async def get_survey_questions() -> dict:
    """
    Returns the survey question definitions so the frontend can render them
    dynamically without hardcoding option labels.
    """
    return {
        "questions": [
            {
                "id": "topic",
                "question": "What topic do you want to learn more about?",
                "type": "free_response",
                "placeholder": "e.g. Machine Learning, Spanish guitar, Personal finance…",
            },
            {
                "id": "skill_level",
                "question": "What is your current skill level?",
                "type": "single_choice",
                "options": [
                    {"value": "complete_beginner", "label": "Complete beginner"},
                    {"value": "know_basics", "label": "I know the basics"},
                    {
                        "value": "intermediate",
                        "label": "Intermediate — I've practiced but have gaps",
                    },
                    {
                        "value": "advanced",
                        "label": "Advanced — I want to refine specific areas",
                    },
                ],
            },
            {
                "id": "learning_goal",
                "question": "What do you wish to gain from using our program?",
                "type": "single_choice",
                "options": [
                    {
                        "value": "career",
                        "label": "Career & Professional Growth",
                        "description": "Focus on industry applications",
                    },
                    {
                        "value": "hobby",
                        "label": "Personal Hobby & Fun",
                        "description": "Focus on creative and enjoyable projects",
                    },
                    {
                        "value": "academics",
                        "label": "School & Academics",
                        "description": "Focus on theory and core principles",
                    },
                    {
                        "value": "curious",
                        "label": "Just Curious",
                        "description": "Keep it high-level and interesting",
                    },
                ],
            },
            {
                "id": "instructor_tone",
                "question": "How would you like your AI instructor to sound?",
                "type": "single_choice",
                "options": [
                    {
                        "value": "fun_energetic",
                        "label": "Fun & Energetic",
                        "description": "Upbeat, uses analogies, highly engaging",
                    },
                    {
                        "value": "professional_direct",
                        "label": "Professional & Direct",
                        "description": "No fluff, straight to the facts",
                    },
                    {
                        "value": "coach",
                        "label": "Challenging & Coach-like",
                        "description": "Pushes you to beat your high score",
                    },
                    {
                        "value": "relaxed",
                        "label": "Relaxed & Encouraging",
                        "description": "Paced, supportive, easygoing",
                    },
                ],
            },
            {
                "id": "daily_commitment",
                "question": "How much time can you commit per day?",
                "type": "single_choice",
                "options": [
                    {"value": "5_minutes", "label": "5 minutes (just the daily lesson)"},
                    {"value": "10_15_minutes", "label": "10–15 minutes"},
                    {"value": "30_plus_minutes", "label": "30+ minutes"},
                    {"value": "own_pace", "label": "It varies — I'll go at my own pace"},
                ],
            },
        ]
    }
