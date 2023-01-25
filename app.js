const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/home/home.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
