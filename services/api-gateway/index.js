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
const VIDEO_UPLOAD_URL = 'http://video-upload:5001/upload';
const CONVERSION_URL = 'http://conversion:5002/convert';
const STATUS_URL = 'http://status:5003/status';
const DOWNLOAD_URL = 'http://download:5004/download';

// Forward upload to video-upload service
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();



// Accept multipart/form-data from frontend
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Forward file to video-upload service
    const form = new FormData();
    form.append('file', req.file.buffer, req.file.originalname);
    const uploadResponse = await axios.post(VIDEO_UPLOAD_URL, form, {
      headers: form.getHeaders(),
    });
    const { filename } = uploadResponse.data;

    // Call conversion service with filename
    const convertResponse = await axios.post(CONVERSION_URL, { filename });
    const { audio_file } = convertResponse.data;

    res.json({ message: 'Upload and conversion complete', audio_file });
  } catch (err) {
    res.status(500).json({ error: 'Error in upload/conversion', details: err.message });
  }
});

app.post('/convert', (req, res) => {
  const videoId = req.body.videoId;
  const conversionUrl = `http://conversion:5002/convert`;
  axios.post(conversionUrl, { videoId })
    .then((response) => {
      res.json({ message: 'Conversion started', conversionId: response.data.conversionId });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error starting conversion' });
    });
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
