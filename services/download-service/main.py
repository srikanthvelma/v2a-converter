from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

os.makedirs("/shared/audio", exist_ok=True)
os.makedirs("/shared/status", exist_ok=True)

AUDIO_DIR = "/shared/audio"
STATUS_DIR = "/shared/status"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict it to ["http://localhost:3000"] if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status/{job_id}")
def get_status(job_id: str):
    status_path = os.path.join(STATUS_DIR, f"{job_id}.txt")
    
    if not os.path.exists(status_path):
        return JSONResponse({"status": "processing"})
    
    with open(status_path, "r") as f:
        status = f.read().strip()
    
    return JSONResponse({"status": status})

@app.get("/audio/{filename}")
def get_audio(filename: str):
    audio_path = os.path.join(AUDIO_DIR, filename)

    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")

    return FileResponse(audio_path, media_type="audio/mpeg", filename=filename)
