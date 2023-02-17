const express = require('express');
const path = require('path');
const ejs = require('ejs');

const env = {
  server: 'local',
};

const server = express();
const port = 80;
server.use('/dist', express.static(path.join(__dirname, 'dist')));
// TO DO : Add Environment variables
if (env.server === 'local') {
  server.use('/assets', express.static(path.join(__dirname, 'assets')));
}
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
  res.render('home.ejs');
});

server.listen(port, () => {
  console.log(`Example server listening on port ${port}`);
});
