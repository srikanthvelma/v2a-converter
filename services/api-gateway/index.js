const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

// Example backend service URLs (change as needed for your environment)
const VIDEO_UPLOAD_URL = 'http://localhost:5001/upload';
const STATUS_URL = 'http://localhost:5002/status';
const DOWNLOAD_URL = 'http://localhost:5003/download';

// Forward upload to video-upload service
app.post('/upload', async (req, res) => {
  try {
    const response = await axios.post(VIDEO_UPLOAD_URL, req.body, { headers: req.headers });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Error forwarding to video-upload service', details: err.message });
  }
});

// Forward status to status service
app.get('/status/:id', async (req, res) => {
  try {
    const response = await axios.get(`${STATUS_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Error forwarding to status service', details: err.message });
  }
});

// Forward download to download service
app.get('/download/:id', async (req, res) => {
  try {
    const response = await axios.get(`${DOWNLOAD_URL}/${req.params.id}`, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Error forwarding to download service', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
