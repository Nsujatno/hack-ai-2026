"""
Video generation node for the LangGraph pipeline.
Uses the D-ID Clips API with built-in presenters (no external image URL needed).
"""
import time
import tempfile
import os
import requests

from app.config import get_settings
from app.database import get_supabase
from ..state import PipelineState

settings = get_settings()
supabase = get_supabase()

DID_CLIPS_URL = "https://api.d-id.com/clips"
POLL_INTERVAL_SECONDS = 5
MAX_POLL_ATTEMPTS = 60  # 5 minutes max
STORAGE_BUCKET = "lesson-videos"

# D-ID's default built-in male presenter. No external image needed.
DEFAULT_PRESENTER_ID = "jack-Pt27VkP3hW"

def get_headers():
    return {
        "Authorization": f"Basic {settings.did_api_key}",
        "Content-Type": "application/json",
        "accept": "application/json"
    }

def generate_veo_node(state: PipelineState) -> dict:
    """
    Calls the D-ID Clips API with a built-in presenter to generate a talking-head video.
    Downloads the result, uploads to Supabase Storage, and returns the permanent public URL.
    """
    if not settings.did_api_key:
        print("WARNING: DID_API_KEY not found in .env. Skipping video generation.")
        return {"veo_video_url": None}

    print("Calling D-ID Clips API to generate talking-head video...")

    lesson_script = state.get("lesson_script", "")
    input_hash = state.get("input_hash", "unknown")

    if not lesson_script:
        print("No script found to generate video.")
        return {"veo_video_url": None}

    try:
        # Step 1: Create the Clip job
        payload = {
            "presenter_id": DEFAULT_PRESENTER_ID,
            "script": {
                "type": "text",
                "subtitles": False,
                "provider": {
                    "type": "elevenlabs",
                    "voice_id": settings.elevenlabs_voice_id,
                    "voice_config": {
                        "api_key": settings.elevenlabs_api_key
                    }
                },
                "input": lesson_script
            },
            "background": {
                "color": "#0f172a"  # Dark slate — avoids the default green screen
            },
            "config": {
                "fluent": False,
                "pad_audio": 0.0,
                "result_format": "mp4"
            }
        }

        response = requests.post(DID_CLIPS_URL, json=payload, headers=get_headers())

        if response.status_code != 201:
            print(f"D-ID Clips API Error ({response.status_code}): {response.text}")
            return {"veo_video_url": None}

        job_data = response.json()
        job_id = job_data.get("id")

        if not job_id:
            print("Failed to get clip job ID from D-ID response.")
            return {"veo_video_url": None}

        print(f"D-ID Clip job started. ID: {job_id}")

        # Step 2: Poll until done
        poll_url = f"{DID_CLIPS_URL}/{job_id}"
        attempts = 0

        while attempts < MAX_POLL_ATTEMPTS:
            attempts += 1
            print(f"D-ID generating... waiting {POLL_INTERVAL_SECONDS}s (attempt {attempts})")
            time.sleep(POLL_INTERVAL_SECONDS)

            poll_resp = requests.get(poll_url, headers=get_headers())
            if poll_resp.status_code != 200:
                print(f"Error polling D-ID Clips API: {poll_resp.text}")
                continue

            status_data = poll_resp.json()
            status = status_data.get("status")

            if status == "done":
                did_result_url = status_data.get("result_url")
                print(f"D-ID done! Downloading video from: {did_result_url}")

                # Step 3: Download video bytes from D-ID
                video_resp = requests.get(did_result_url, stream=True)
                with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp_file:
                    tmp_path = tmp_file.name
                    for chunk in video_resp.iter_content(chunk_size=8192):
                        tmp_file.write(chunk)

                # Step 4: Upload to Supabase Storage for a permanent streaming URL
                storage_path = f"{input_hash}.mp4"
                with open(tmp_path, "rb") as video_file:
                    video_bytes = video_file.read()

                supabase.storage.from_(STORAGE_BUCKET).upload(
                    path=storage_path,
                    file=video_bytes,
                    file_options={"content-type": "video/mp4", "upsert": "true"}
                )
                os.unlink(tmp_path)

                # Step 5: Get the Supabase public URL (streams properly, no download prompt)
                public_url = supabase.storage.from_(STORAGE_BUCKET).get_public_url(storage_path)
                print(f"Uploaded to Supabase Storage. Public URL: {public_url}")
                return {"veo_video_url": public_url}

            elif status == "error":
                print(f"D-ID Clip generation failed: {status_data}")
                return {"veo_video_url": None}

        print("D-ID Clip generation timed out.")
        return {"veo_video_url": None}

    except Exception as e:
        print(f"Error during D-ID Clips generation: {e}")
        return {"veo_video_url": None}

