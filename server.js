const express = require('express');
const path = require('path');
if (process.env.ENVIRONMENT !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const server = express();
const port = process.env.SERVER_PORT || 3000;
server.set('view engine', 'ejs');

// #############################################################################
// Logs all request paths and method
server.use(function (req, res, next) {
  res.set('x-timestamp', Date.now())
  res.set('x-powered-by', 'cyclic.sh')
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

server.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.ENVIRONMENT === 'local') {
  server.use('/assets', express.static(path.join(__dirname, 'assets')));
}

server.get(`${process.env.API_ROUTE}/job-categories`, (req, res) => {
  const sJobCategoriesDataURL = `${process.env.DOMAIN}${process.env.ASSET_LINK}/data/job-categories.json`;

  console.log(sJobCategoriesDataURL);
  fetch(sJobCategoriesDataURL, { method: 'Get' })
    .then((oResponse) => oResponse.json())
    .then((oJobCategories) => {
      const aJobCategories = oJobCategories.jobCategories;
      const iStart = (req.query.start) ? parseInt(req.query.start, 10) : 0;
      const iCount = (req.query.count) ? iStart + parseInt(req.query.count, 10) : iStart + 3;
      return res.send(aJobCategories.slice(iStart, iCount));
    });
});

server.get('/', (req, res) => {
  fetch(`${process.env.DOMAIN}${process.env.API_ROUTE}/job-categories?count=9`)
    .then(async(oResponse) => {
      const aJobCategories = await oResponse.json();
      res.render('home.ejs', { jobCategories: aJobCategories, assetLink: process.env.ASSET_LINK });
    });
});

server.get('/job/:jobTitle', (req, res) => {
  console.log(req.params);
  res.render('job-posting.ejs', { assetLink: process.env.ASSET_LINK });
});

server.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
