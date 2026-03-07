"""
Test script to run the LangGraph pipeline locally.

Run with:
python src/app/langgraph/test_pipeline.py
"""
import sys
import os
import json
import time

# Add the 'src' directory to the Python path so absolute imports like 'app.config' work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from app.langgraph.graph import invoke_pipeline

def main():
    print("===========================================")
    print("Testing LangGraph Generation Pipeline")
    print("===========================================\n")
    
    # The actual database row you provided
    inputs = {
        "topic": "ai",
        "skill_level": "complete_beginner",
        "goal": "curious",
        "instructor_tone": "fun_energetic",
        "time_commitment": "5_minutes"
    }
    
    # ---------------------------------------------------------
    # RUN 1: This should be a MISS, and trigger Gemini Generation
    # ---------------------------------------------------------
    print(">>> RUN 1 (Expected Cache MISS, Full Generation) <<<")
    start_time = time.time()
    
    result_1 = invoke_pipeline(inputs)
    
    end_time = time.time()
    
    print("\n--- RESULTS RUN 1 ---")
    print(f"Time taken: {end_time - start_time:.2f} seconds")
    print(f"Cache Hit: {result_1.get('cache_hit')}")
    print(f"Input Hash: {result_1.get('input_hash')}")
    print("\nGenerated Lesson Plan:")
    print(json.dumps(result_1.get("lesson_plan_json", {}), indent=2))
    print("\nGenerated Learning Path (Duolingo Style):")
    print(json.dumps(result_1.get("learning_path", []), indent=2))
    print("\nGenerated Script:")
    print(result_1.get("lesson_script"))
    print("\nGenerated Veo Prompt:")
    print(result_1.get("veo_prompt"))
    print("\nMock Veo Video URL:")
    print(result_1.get("veo_video_url"))
    
    print("\n" + "="*50 + "\n")
    
    # ---------------------------------------------------------
    # RUN 2: This should be a HIT, and return instantly
    # ---------------------------------------------------------
    print(">>> RUN 2 (Expected Cache HIT, Instant Return) <<<")
    start_time = time.time()
    
    result_2 = invoke_pipeline(inputs)
    
    end_time = time.time()
    
    print("\n--- RESULTS RUN 2 ---")
    print(f"Time taken: {end_time - start_time:.2f} seconds")
    print(f"Cache Hit: {result_2.get('cache_hit')}")
    print("\nCached Learning Path Output:")
    print(json.dumps(result_2.get("learning_path", []), indent=2))
    print("\nCached Script Output:")
    print(result_2.get("lesson_script"))
    print("\nDone!")

if __name__ == "__main__":
    main()
