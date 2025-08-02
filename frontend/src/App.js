import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || "http://upload:8000";
const STATUS_BASE = process.env.REACT_APP_STATUS_BASE || "http://upload:8001";
const DOWNLOAD_BASE = process.env.REACT_APP_DOWNLOAD_BASE || "http://download:8002";

function App() {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleUpload = async () => {
    if (!video) return alert('Please select a video file first.');

    const formData = new FormData();
    formData.append('file', video);
    setUploading(true);
    setStatus(null);
    setAudioUrl(null);

    try {
      const uploadRes = await axios.post(
        `${API_BASE}/upload`,
        formData
      );
      const { video_id } = uploadRes.data;

      const pollStatus = async () => {
        try {
          const res = await axios.get(
            `${STATUS_BASE}/status/${video_id}`
          );
          if (res.data.status === 'completed') {
            setStatus('Completed');
            setAudioUrl(`${DOWNLOAD_BASE}/download/${video_id}`);
          } else {
            setTimeout(pollStatus, 2000);
          }
        } catch (err) {
          console.error(err);
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. See console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>🎬 Video to 🎧 Audio Converter</h1>
      <div className="card">
        <label htmlFor="upload" className="upload-label">
          Choose a video file
        </label>
        <input
          id="upload"
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={uploading} className="convert-btn">
          {uploading ? 'Uploading...' : 'Convert'}
        </button>

        {status && <p className="status">Status: {status}</p>}

        {audioUrl && (
          <div className="audio-section">
            <p>Your audio file is ready:</p>
            <audio controls src={audioUrl}></audio>
            <br />
            <a href={audioUrl} download className="download-link">
              ⬇️ Download MP3
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
