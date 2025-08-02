import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://upload:8000";
const STATUS_BASE = process.env.REACT_APP_STATUS_BASE || "http://converter:8001";
const DOWNLOAD_BASE = process.env.REACT_APP_DOWNLOAD_BASE || "http://download:8002";

function App() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [downloadReady, setDownloadReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a video file to upload.");

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const id = response.data.job_id;
      setJobId(id);
      setStatus("Processing...");
      setDownloadReady(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!jobId) return alert("No job ID found.");

    try {
      const response = await axios.get(`${STATUS_BASE}/status/${jobId}`);
      const currentStatus = response.data.status;
      setStatus(currentStatus);

      if (currentStatus === "completed") {
        setDownloadReady(true);
      }
    } catch (error) {
      console.error("Status check failed:", error);
      alert("Failed to check status.");
    }
  };

  const handleDownload = () => {
    if (!jobId) return alert("No job ID available.");
    window.open(`${DOWNLOAD_BASE}/download/${jobId}`, "_blank");
  };

  return (
    <div className="App">
      <h2>🎥 Video to Audio Converter</h2>

      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Video"}
      </button>

      {jobId && (
        <>
          <p>Job ID: {jobId}</p>
          <button onClick={checkStatus}>Check Status</button>
          <p>Status: {status}</p>
        </>
      )}

      {downloadReady && (
        <button onClick={handleDownload}>Download Audio</button>
      )}
    </div>
  );
}

export default App;
