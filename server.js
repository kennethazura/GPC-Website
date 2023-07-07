const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

if (process.env.ENVIRONMENT !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const server = express();
const port = process.env.SERVER_PORT || 3000;
server.set('view engine', 'ejs');

// #############################################################################
// Logs all request paths and method
server.use(function(req, res, next) {
  res.set('x-timestamp', Date.now());
  res.set('x-powered-by', 'cyclic.sh');
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

server.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.ENVIRONMENT === 'local') {
  server.use('/assets', express.static(path.join(__dirname, 'assets')));
}

server.get(`${process.env.API_ROUTE}/job-categories`, (req, res) => {
  const sJobCategoriesDataURL = `${process.env.DOMAIN}${process.env.ASSET_LINK}/data/job-categories.json`;

  fetch(sJobCategoriesDataURL, { method: 'Get' })
    .then((oResponse) => oResponse.json())
    .then((oJobCategories) => {
      const aJobCategories = oJobCategories.jobCategories;
      const iStart = (req.query.start) ? parseInt(req.query.start, 10) : 0;
      const iCount = (req.query.count) ? iStart + parseInt(req.query.count, 10) : iStart + 3;
      return res.send(aJobCategories.slice(iStart, iCount));
    });
});

server.get(`${process.env.API_ROUTE}/job-details`, (req, res) => {
  const sJobDataURL = `${process.env.DOMAIN}${process.env.ASSET_LINK}/data/job-details.json`;

  fetch(sJobDataURL, { method: 'Get' })
    .then((oResponse) => oResponse.json())
    .then((oJobDetails) => {
      const aJobs = oJobDetails.jobDetails;
      const iLength = aJobs.length;
      let oJob = '';

      for (let iCount = 0; iCount < iLength; iCount += 1) {
        if (aJobs[iCount].title.replace(/[^a-zA-Z]/g, '').toLowerCase().includes(req.query.title.replace(/[^a-zA-Z]/g, '').toLowerCase())) oJob = aJobs[iCount];
      }

      if (oJob === '') return res.send({ error: `Error! "${req.query.title}" not found.` });
      return res.send(oJob);
    });
});

server.get('/', (req, res) => {
  res.render('home.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
    reCaptchaKey: process.env.RECAPTCHA_SITE_KEY,
  });
});

server.get('/job/:jobTitle', (req, res) => {
  fetch(`${process.env.DOMAIN}${process.env.API_ROUTE}/job-details?title=${req.params.jobTitle}`)
    .then(async(oResponse) => {
      const oJobDetails = await oResponse.json();
      if (Object.prototype.hasOwnProperty.call(oJobDetails, 'error')) res.send(`Error! "${req.params.jobTitle}" not found.`);
      else {
        res.render('job-posting.ejs', {
          jobDetails: oJobDetails,
          assetLink: process.env.ASSET_LINK,
          domain: process.env.DOMAIN,
          apiRoute: process.env.API_ROUTE,
        });
      }
    });
});

server.get('/terms-and-conditions', (req, res) => {
  res.render('terms-and-conditions.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
  });
});

server.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

function _getCurrentDate() {
  const date = new Date();

  const currentDay = String(date.getDate()).padStart(2, '0');
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const currentYear = date.getFullYear();

  return `${currentDay}-${currentMonth}-${currentYear}`;
}

server.post(`${process.env.API_ROUTE}/send-mail`, (req, res) => {
  const NAME = req.query.name;
  const EMAIL = req.query.email;
  const PHONE = req.query.phone;
  const MESSAGE = req.query.message;
  console.log(req.query);

  async function main() {
    const transporter = nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: 'kenneth_azura@yahoo.com',
        pass: 'qwrajbmlaggclttx',
      },
    });

    const info = await transporter.sendMail({
      from: '"Kenneth Azura" <kenneth_azura@yahoo.com>',
      to: 'dlegario@gpc.team',
      cc: 'kpena@kbfcpa.com',
      subject: `GPC Contact Us - Submission (${_getCurrentDate()})`,
      html: `<b>Name:</b> ${NAME}<br/>
      <b>E-Mail:</b> ${EMAIL}<br/>
      <b>Phone:</b> ${PHONE}<br/>
      <b>Message:</b> ${MESSAGE}<br/>`,
    });

    console.log('Message sent: %s', info.messageId);
  }

  main().catch(console.error);
  return res.send('OK');
});
