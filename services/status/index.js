const express = require('express');
const app = express();
const port = 5003;

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Status Service is running');
});

// Status endpoint
app.get('/status/:id', (req, res) => {
  // Simulate job status
  res.json({ job_id: req.params.id, status: 'completed' });
});

app.listen(port, () => {
  console.log(`Status Service listening at http://localhost:${port}`);
});
