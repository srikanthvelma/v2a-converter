from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
import shutil
import requests

os.makedirs("/shared/videos", exist_ok=True)

UPLOAD_DIR = "/shared/videos"
CONVERT_SERVICE_URL = "http://converter:8001/convert"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict it to ["http://localhost:3000"] if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/upload")
async def upload_video(video: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_DIR, f"{job_id}.mp4")

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Notify convert service
    requests.post(CONVERT_SERVICE_URL, json={"job_id": job_id})

    return JSONResponse({"job_id": job_id})
