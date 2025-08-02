import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [jobId, setJobId] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('video', videoFile);

    const res = await axios.post('http://localhost:8000/upload', formData);
    setJobId(res.data.job_id);
    setStatus('Processing...');

    // Polling for job completion
    const interval = setInterval(async () => {
      const statusRes = await axios.get(`http://localhost:8002/status/${res.data.job_id}`);
      if (statusRes.data.status === 'completed') {
        clearInterval(interval);
        setAudioUrl(`http://localhost:8002/audio/${res.data.job_id}.mp3`);
        setStatus('Done!');
      }
    }, 2000);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Video to Audio Converter</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={handleUpload}
        disabled={!videoFile}
      >
        Upload & Convert
      </button>

      <p className="mt-4">{status}</p>
      {audioUrl && (
        <a className="text-blue-600" href={audioUrl} download>
          Download Audio
        </a>
      )}
    </div>
  );
}

// Note: Ensure that the backend services are running on the specified ports (8000 for upload and 8002 for status/audio retrieval).
// This code assumes that the backend is set up to handle the video upload and processing as described
