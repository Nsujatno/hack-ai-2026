from pydantic import BaseModel, Field

from app.models import (
    DailyCommitment,
    InstructorTone,
    LearningGoal,
    SkillLevel,
)


class SurveySubmission(BaseModel):
    """
    The four onboarding survey questions.
    user_id is optional for now — pass it when Supabase Auth is wired up.
    """

    user_id: str | None = Field(
        default=None,
        description="Supabase auth user UUID (optional during hackathon)",
    )

    # Q1 — free response
    topic: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="What topic the user wants to learn more about",
        examples=["Machine Learning", "Spanish guitar", "Personal finance"],
    )

    # Q2 — skill level
    skill_level: SkillLevel = Field(
        ...,
        description="The user's current skill level for the chosen topic",
    )

    # Q3 — learning goal (A/B/C/D)
    learning_goal: LearningGoal = Field(
        ...,
        description="What the user wants to gain from the program",
    )

    # Q4 — instructor tone (A/B/C/D)
    instructor_tone: InstructorTone = Field(
        ...,
        description="Preferred AI instructor personality",
    )

    # Q5 — daily time commitment
    daily_commitment: DailyCommitment = Field(
        ...,
        description="How much time the user can commit per day",
    )


class SurveyResponse(BaseModel):
    """Returned after a successful survey submission."""

    survey_id: str = Field(description="UUID of the saved survey row in Supabase")
    user_id: str | None
    topic: str
    skill_level: SkillLevel
    learning_goal: LearningGoal
    instructor_tone: InstructorTone
    daily_commitment: DailyCommitment
    message: str = "Survey submitted successfully"
