
import React, { useState, useEffect } from 'react';


const App = () => {
  const [videoId, setVideoId] = useState('');
  const [conversionId, setConversionId] = useState('');
  const [status, setStatus] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const handleUpload = (event) => {
    const videoFile = event.target.files[0];
    const videoId = uuidv4();
    setVideoId(videoId);
    fetch('/upload', {
      method: 'POST',
      body: JSON.stringify({ videoId, videoFile }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleConvert = () => {
    axios.post('/convert', { videoId })
      .then((response) => {
        setConversionId(response.data.conversionId);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStatus = () => {
    axios.get('/status', { params: { conversionId } })
      .then((response) => {
        setStatus(response.data.status);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDownload = () => {
    axios.get('/download', { params: { conversionId } })
      .then((response) => {
        setAudioFile(response.data.audioFile);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Video to Audio Converter</h1>
      <input type="file" onChange={handleUpload} />
      <button onClick={handleConvert}>Convert</button>
      <button onClick={handleStatus}>Check Status</button>
      <button onClick={handleDownload}>Download</button>
      <p>Status: {status}</p>
      {audioFile && (
        <audio controls>
          <source src={audioFile} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default App;