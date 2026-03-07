"""
LLM generation nodes for the LangGraph pipeline.
Uses gemini-2.5-flash-lite.
"""
import json
from typing import Dict, Any
from google import genai
from google.genai import types

from ..state import PipelineState
from app.config import get_settings

# Initialize the Gemini Client
settings = get_settings()
client = genai.Client(api_key=settings.gemini_api_key)
GEMINI_MODEL_NAME = "gemini-2.5-flash-lite"

def generate_plan_node(state: PipelineState) -> dict:
    """
    Uses Gemini to generate the JSON lesson plan based on user onboarding inputs.
    Returns the partial state update for `lesson_plan_json`.
    """
    print(f"Generating lesson plan for topic: {state.get('topic')}")
    
    prompt = f"""
    You are an expert AI instructor. A user wants to learn about: {state.get('topic')}.
    Their current skill level is: {state.get('skill_level')}.
    Their goal is: {state.get('goal')}.
    They want to spend {state.get('time_commitment')} a day learning.
    
    Generate a highly engaging, single introductory lesson plan.
    Include a title, a short description, and exactly 3 multiple choice quiz questions.
    
    Return the output STRICTLY as a JSON object with this exact schema:
    {{
        "title": "String",
        "description": "String",
        "quiz": [
            {{
                "question": "String",
                "correct_answer": "String",
                "options": ["String", "String", "String", "String"]
            }}
        ]
    }}
    """
    
    response = client.models.generate_content(
        model=GEMINI_MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.7
        )
    )
    
    try:
        lesson_plan = json.loads(response.text)
    except Exception as e:
        print(f"Error parsing JSON from Gemini: {e}")
        lesson_plan = {"error": "Failed to parse JSON"}
        
    return {"lesson_plan_json": lesson_plan}

def generate_script_node(state: PipelineState) -> dict:
    """
    Uses Gemini to write a 30-second script based on the generated lesson plan,
    and generate the Veo visual prompt.
    Returns partial state updates for `lesson_script` and `veo_prompt`.
    """
    print("Generating lesson script and Veo prompt")
    
    lesson_plan = state.get('lesson_plan_json', {})
    title = lesson_plan.get('title', state.get('topic'))
    
    description = lesson_plan.get('description', '')
    
    prompt = f"""
    You are an AI video instructor delivering a 30-second lesson.
    Lesson Title: {title}
    Lesson Description: {description}
    Instructor Tone: {state.get('instructor_tone')}
    
    Your task is to write a voiceover script that TEACHES the core concept of this lesson directly.
    DO NOT write a teaser, intro, or promise of what will be covered. Jump straight into teaching.
    The learner should walk away knowing something concrete after 30 seconds.
    The script MUST be exactly 65 to 75 words long.
    
    Also write a highly descriptive visual prompt for the Google Veo video generator.
    CRITICAL: The video must feature a HUMAN INSTRUCTOR looking directly at the camera and teaching. 
    Describe the person's appearance, their expression, and their background setting (which should fit the topic: {title}).
    For example: "Medium close-up of a friendly female instructor in a bright tech office, looking directly at the camera with an energetic smile, speaking enthusiastically."
    No abrupt camera movements. Keep the prompt under 50 words. Do not request 4k, 8k, or ultra-high-definition as we want to save on generation costs.
    
    Return STRICTLY as a JSON object:
    {{
        "script": "String (the 65-75 word teaching script)",
        "veo_prompt": "String (the visual prompt)"
    }}
    """
    
    response = client.models.generate_content(
        model=GEMINI_MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.7
        )
    )
    
    try:
        result = json.loads(response.text)
        script = result.get("script", "")
        veo_prompt = result.get("veo_prompt", "")
    except Exception as e:
        print(f"Error parsing Gemini script response: {e}")
        script = "Error generating script."
        veo_prompt = "Error generating visual prompt."
    
    return {
        "lesson_script": script,
        "veo_prompt": veo_prompt
    }

def generate_learning_path_node(state: PipelineState) -> dict:
    """
    Generates a full Duolingo-style learning path of 6 lesson titles for the skill.
    The first lesson is unlocked; the rest are greyed out placeholders.
    Returns the partial state update for `learning_path`.
    """
    print("Generating Duolingo-style learning path overview")
    
    first_lesson_title = state.get('lesson_plan_json', {}).get('title', state.get('topic'))
    
    prompt = f"""
    A user is learning: {state.get('topic')} (Skill Level: {state.get('skill_level')}, Goal: {state.get('goal')}).
    
    The very first lesson is already decided: "{first_lesson_title}"
    
    Generate 5 more logical follow-up lesson titles that would naturally come AFTER this first lesson.
    They should progress in difficulty and build on each other, like levels in Duolingo.
    
    Return STRICTLY as a JSON array of 6 objects (first one included), each with:
    {{
        "lesson_number": 1,
        "title": "String",
        "is_unlocked": true
    }}
    
    Only lesson_number 1 should have "is_unlocked": true. All others should be false.
    """
    
    response = client.models.generate_content(
        model=GEMINI_MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.6
        )
    )
    
    try:
        learning_path = json.loads(response.text)
    except Exception as e:
        print(f"Error parsing learning path from Gemini: {e}")
        learning_path = [{"lesson_number": 1, "title": first_lesson_title, "is_unlocked": True}]
    
    return {"learning_path": learning_path}
