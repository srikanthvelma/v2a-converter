const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('Download Service: Hello World!');
});

app.listen(port, () => {
  console.log(`Download Service listening at http://localhost:${port}`);
});
