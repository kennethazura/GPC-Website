const express = require('express');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

const server = express();
const port = process.env.SERVER_PORT;
server.set('view engine', 'ejs');
server.use('/dist', express.static(path.join(__dirname, 'dist')));
if (process.env.ENVIRONMENT === 'local') {
  server.use('/assets', express.static(path.join(__dirname, 'assets')));

  server.get(process.env.API_ROUTE + '/job-categories', (req, res) => {
    const oJobCategories = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets/data/job-categories.json'), 'utf8'));
    const aJobCategories = oJobCategories.jobCategories;
    const iStart = (req.query.start) ? parseInt(req.query.start, 10) : 0;
    const iCount = (req.query.count) ? iStart + parseInt(req.query.count, 10) : iStart + 3;
    return res.send(aJobCategories.slice(iStart, iCount));
  });
}

server.get('/', (req, res) => {
  /** TO DO : If this is dynamic data, to change once actual data is available */
  fetch('http://local.gpc.com/api/job-categories?count=6')
    .then(async(oResponse) => {
      const aJobCategories = await oResponse.json();
      res.render('home.ejs', { jobCategories: aJobCategories, assetLink: process.env.ASSET_LINK });
    });
});

server.listen(port, () => {
  console.log(`Example server listening on port ${port}`);
});
