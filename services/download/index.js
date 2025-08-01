const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5004;

const AUDIO_FOLDER = '/data/audio';
if (!fs.existsSync(AUDIO_FOLDER)) {
  fs.mkdirSync(AUDIO_FOLDER, { recursive: true });
}

// Health check
app.get('/', (req, res) => {
  res.send('Download Service is running');
});

// Download endpoint
app.get('/download/:id', (req, res) => {
  // Simulate audio file download
  const audioFile = path.join(AUDIO_FOLDER, req.params.id + '.mp3');
  if (fs.existsSync(audioFile)) {
    res.download(audioFile);
  } else {
    res.status(404).json({ error: 'Audio file not found' });
  }
});

app.listen(port, () => {
  console.log(`Download Service listening at http://localhost:${port}`);
});
