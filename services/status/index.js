const express = require('express');
const app = express();
const port = 5003;

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Status Service is running');
});

// Status endpoint
app.get('/status', (req, res) => {
  const conversionId = req.query.conversionId;
  if (!conversionId) {
    return res.json({ message: 'No conversionId provided' });
  }
  // Check the status of the conversion
  const status = getStatus(conversionId);
  res.json({ message: 'Conversion status', status });
});

app.listen(port, () => {
  console.log(`Status Service listening at http://localhost:${port}`);
});
