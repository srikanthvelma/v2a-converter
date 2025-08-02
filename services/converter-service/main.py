from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os

os.makedirs("/shared/videos", exist_ok=True)
os.makedirs("/shared/audio", exist_ok=True)
os.makedirs("/shared/status", exist_ok=True)

VIDEO_DIR = "/shared/videos"
AUDIO_DIR = "/shared/audio"
STATUS_DIR = "/shared/status"



app = FastAPI()

class ConvertRequest(BaseModel):
    job_id: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict it to ["http://localhost:3000"] if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/convert")
def convert_video(data: ConvertRequest):
    job_id = data.job_id
    video_path = os.path.join(VIDEO_DIR, f"{job_id}.mp4")
    audio_path = os.path.join(AUDIO_DIR, f"{job_id}.mp3")
    status_path = os.path.join(STATUS_DIR, f"{job_id}.txt")

    try:
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file {video_path} not found")

        # Convert using ffmpeg
        subprocess.run([
            "ffmpeg", "-i", video_path,
            "-vn",  # no video
            "-acodec", "libmp3lame",
            "-q:a", "2",  # quality level (lower is better)
            audio_path
        ], check=True)

        # Mark as completed
        with open(status_path, "w") as f:
            f.write("completed")

        return {"message": "Conversion done"}
    
    except Exception as e:
        # Mark as failed
        with open(status_path, "w") as f:
            f.write("failed")
        return {"error": str(e)}
