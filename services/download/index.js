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
app.get('/download', (req, res) => {
  const conversionId = req.query.conversionId;
  if (!conversionId) {
    return res.json({ message: 'No conversionId provided' });
  }
  // Download the converted audio file
  const audioFile = getAudioFile(conversionId);
  res.download(audioFile);
});

app.listen(port, () => {
  console.log(`Download Service listening at http://localhost:${port}`);
});
