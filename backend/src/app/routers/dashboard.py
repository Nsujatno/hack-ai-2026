import hashlib
from fastapi import APIRouter, HTTPException
from app.database import get_supabase

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/{user_id}")
async def get_dashboard(user_id: str):
    db = get_supabase()
    
    # 1. Fetch latest survey for user
    res = db.table("onboarding_surveys").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="No survey found for user")
        
    survey = res.data[0]
    
    # 2. Recompute input_hash
    topic = survey.get("topic", "")
    skill_level = survey.get("skill_level", "")
    goal = survey.get("learning_goal", "")
    instructor_tone = survey.get("instructor_tone", "")
    time_commitment = survey.get("daily_commitment", "")
    
    concat_str = f"{topic}_{skill_level}_{goal}_{instructor_tone}_{time_commitment}".lower()
    input_hash = hashlib.md5(concat_str.encode()).hexdigest()
    
    # 3. Fetch from lesson_cache
    cache_res = db.table("lesson_cache").select("*").eq("input_hash", input_hash).execute()
    if not cache_res.data:
        raise HTTPException(status_code=404, detail="Lesson cache not found or still processing")
        
    cached_data = cache_res.data[0]
    
    # 4. Transform Output
    learning_path = cached_data.get("learning_path", [])
    lesson_plan = cached_data.get("lesson_plan_json", {})
    # Get the URL regardless of whether the column is named veo_video_url or another name used in D-ID
    video_url = cached_data.get("d_id_video_url", cached_data.get("veo_video_url", ""))
    
    # Generate nodes
    nodes = []
    positions = [0, 20, 0, -20, 0, 20]
    
    if not learning_path:
        # Fallback if empty
        learning_path = [{"title": lesson_plan.get("title", "Lesson 1"), "is_unlocked": True}]
        
    for i, path_item in enumerate(learning_path):
        is_first = (i == 0)
        node_id = f"l{i+1}"
        nodes.append({
            "id": node_id,
            "title": path_item.get("title", f"Lesson {i+1}"),
            # The first lesson starts active at the top as requested
            "status": "active" if is_first else "locked",
            "type": "lesson" if i < len(learning_path) - 1 else "boss",
            "position": positions[i % len(positions)]
        })
        
    # Transform quiz questions
    quiz_data = lesson_plan.get("quiz", [])
    questions_transformed = []
    for q_idx, q in enumerate(quiz_data):
        options = []
        correct_ans = q.get("correct_answer", "")
        for o_idx, opt in enumerate(q.get("options", [])):
            options.append({
                "id": str(o_idx),
                "text": opt,
                "isCorrect": opt == correct_ans
            })
            
        questions_transformed.append({
            "id": f"q{q_idx+1}",
            "text": q.get("question"),
            "options": options,
            "explanation": f"Correct answer is {correct_ans}."
        })
        
    active_lesson = {
        "id": nodes[0]["id"] if nodes else "l1",
        "title": lesson_plan.get("title", ""),
        "description": lesson_plan.get("description", ""),
        "duration": 30, # simulated duration or use actual if known
        "videoUrl": video_url,
        "questions": questions_transformed
    }
    
    chapter = {
        "id": "ch1",
        "title": f"Unit 1: {topic}",
        "description": "Master the core concepts of your chosen skill.",
        "nodes": nodes
    }
    
    return {
        "chapters": [chapter],
        "activeLesson": active_lesson
    }
