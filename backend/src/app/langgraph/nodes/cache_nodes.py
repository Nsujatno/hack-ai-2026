"""
Cache nodes for the LangGraph pipeline.
Handles Supabase DB lookups and storage.
"""
from typing import Dict, Any
from app.database import get_supabase
from ..state import PipelineState

# Get the centralized Supabase client
supabase = get_supabase()

def check_cache_node(state: PipelineState) -> dict:
    """
    Checks the database to see if a lesson matching the `input_hash` already exists.
    Returns partial state updates (cache_hit and pre-generated outputs if found).
    """
    input_hash = state.get('input_hash')
    print(f"Checking cache for hash: {input_hash}")
    
    try:
        response = supabase.table("lesson_cache").select("*").eq("input_hash", input_hash).execute()
        
        if response.data and len(response.data) > 0:
            print("Cache HIT!")
            cached_data = response.data[0]
            return {
                "cache_hit": True,
                "lesson_plan_json": cached_data.get("lesson_plan_json"),
                "lesson_script": cached_data.get("lesson_script"),
                "veo_prompt": cached_data.get("veo_prompt"),
                "veo_video_url": cached_data.get("veo_video_url"),
                "learning_path": cached_data.get("learning_path")
            }
            
    except Exception as e:
        print(f"Error querying Supabase cache: {e}")
        
    print("Cache MISS!")
    return {"cache_hit": False}

def save_cache_node(state: PipelineState) -> dict:
    """
    Saves the final generated outputs to the database against the `input_hash`.
    Returns an empty dict as it's the last node.
    """
    input_hash = state.get('input_hash')
    print(f"Saving outputs for hash: {input_hash} to cache")
    
    try:
        data_to_insert = {
            "input_hash": input_hash,
            "topic": state.get("topic"),
            "skill_level": state.get("skill_level"),
            "goal": state.get("goal"),
            "instructor_tone": state.get("instructor_tone"),
            "time_commitment": state.get("time_commitment"),
            "lesson_plan_json": state.get("lesson_plan_json"),
            "lesson_script": state.get("lesson_script"),
            "veo_prompt": state.get("veo_prompt"),
            "veo_video_url": state.get("veo_video_url"),
            "learning_path": state.get("learning_path")
        }
        
        supabase.table("lesson_cache").upsert(data_to_insert).execute()
        print("Successfully saved to Supabase cache.")
        
    except Exception as e:
        print(f"Error saving to Supabase cache: {e}")
        
    return {}
