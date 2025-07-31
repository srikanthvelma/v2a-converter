const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Status Service: Hello World!');
});

app.listen(port, () => {
  console.log(`Status Service listening at http://localhost:${port}`);
});
