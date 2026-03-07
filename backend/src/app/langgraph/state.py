from typing import TypedDict, Optional, Dict, Any

class PipelineState(TypedDict):
    """
    The state dictionary for the LangGraph lesson generation pipeline.
    """
    # Inputs (from onboarding)
    topic: str
    skill_level: str
    goal: str
    instructor_tone: str
    time_commitment: str
    
    # Internal routing & caching
    input_hash: str
    cache_hit: bool
    
    # Single Lesson Outputs (to protect API limits)
    lesson_plan_json: Optional[Dict[str, Any]]
    lesson_script: Optional[str]
    veo_prompt: Optional[str]
    veo_video_url: Optional[str]
    
    # Full learning path overview (Duolingo-style map)
    learning_path: Optional[list]
