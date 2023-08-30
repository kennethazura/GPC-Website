const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

if (process.env.ENVIRONMENT !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const server = express();
const port = process.env.SERVER_PORT || 3000;
server.set('view engine', 'ejs');

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// #############################################################################
// Logs all request paths and method
server.use(function(req, res, next) {
  res.set('x-timestamp', Date.now());
  res.set('x-powered-by', 'cyclic.sh');
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

function _verifyRecaptcha(recaptchaResponse) {
  return fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`,
    },
  ).then((oResponse) => oResponse.json().then((data) => data).catch((err) => {
  }));
}

server.post(`${process.env.API_ROUTE}/send-mail`, urlencodedParser, async(req, res) => {
  const NAME = req.body['c-name'];
  const EMAIL = req.body['c-email'];
  const PHONE = req.body['c-phone'];
  const MESSAGE = req.body['c-message'];
  const RECAPTCHA_RESPONSE = req.body['g-recaptcha-response'];
  const oResponseStatus = {
    success: false,
    message: '',
  };

  async function main() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreply@gpc.team',
        pass: 'nuuxhfyphwxzqxkx',
      },
    });

    const info = await transporter.sendMail({
      from: '"GPC Workforce" <gpc.workforce.sender@gmail.com>',
      // to: 'kenneth.azura@gmail.com',
      to: 'ymendiola@gpc.team',
      cc: 'pbuss@gpc.team',
      subject: `GPC Contact Us - Submission (${_getCurrentDate()})`,
      html: `<b>Name:</b> ${NAME}<br/>
      <b>E-Mail:</b> ${EMAIL}<br/>
      <b>Phone:</b> ${PHONE}<br/>
      <b>Message:</b> ${MESSAGE}<br/>`,
    });

    console.log('Message sent: %s', info.messageId);
  }

  await _verifyRecaptcha(RECAPTCHA_RESPONSE)
    .then((oResponse) => {
      if (oResponse.success === true) {
        main().catch(console.error);
        oResponseStatus.success = true;
        oResponseStatus.message = 'Your message has been sent!';
      } else {
        oResponseStatus.message = 'Unable to verify your ReCaptcha, please try again.';
      }
    });

  return res.send(oResponseStatus);
});
