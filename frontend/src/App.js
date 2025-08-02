
import React, { useState } from 'react';
import { Container, Typography, Box, Button, LinearProgress, Card, CardContent } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
    setAudioUrl('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus('Uploading...');
    setAudioUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://192.168.29.135:8080/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            return response.json();
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
      const data = await response.json();
      if (response.ok && data.audio_file) {
        setStatus('Conversion complete!');
        setAudioUrl(`http://192.168.29.135:8080/download/${data.audio_file}`);
      } else {
        setStatus(data.error || 'Error during upload/conversion');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Video to Audio Converter
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Video
              <input type="file" accept="video/*" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body1">Selected: {file.name}</Typography>}
            <Button
              variant="outlined"
              onClick={handleUpload}
              disabled={!file || uploading}
              sx={{ mt: 2 }}
            >
              Convert to Audio
            </Button>
            {uploading && <LinearProgress sx={{ width: '100%', mt: 2 }} />}
            {status && <Typography variant="body2" sx={{ mt: 2 }}>{status}</Typography>}
            {audioUrl && (
              <Button
                variant="contained"
                color="success"
                href={audioUrl}
                download
                sx={{ mt: 2 }}
              >
                Download Audio
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
