const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const https = require('https');

if (process.env.ENVIRONMENT !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

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

server.get('/search', (req, res) => {
  res.render('landing.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
  });
});

server.get('/candidate-profile', (req, res) => {
  res.render('profile.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
  });
});

server.get('/job-requirement', (req, res) => {
  res.render('job-requirement.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
  });
});

server.get('/company-profile', (req, res) => {
  res.render('company.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
  });
});

server.get('/candidate-list', (req, res) => {
  res.render('candidate-list.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
  });
});

server.get('/job-list', (req, res) => {
  res.render('job-list.ejs', {
    assetLink: process.env.ASSET_LINK,
    domain: process.env.DOMAIN,
    apiRoute: process.env.API_ROUTE,
  });
});

// server.get('/job/:jobTitle', (req, res) => {
//   fetch(`${process.env.DOMAIN}${process.env.API_ROUTE}/job-details?title=${req.params.jobTitle}`)
//     .then(async(oResponse) => {
//       const oJobDetails = await oResponse.json();
//       if (Object.prototype.hasOwnProperty.call(oJobDetails, 'error')) res.send(`Error! "${req.params.jobTitle}" not found.`);
//       else {
//         res.render('job-posting.ejs', {
//           jobDetails: oJobDetails,
//           assetLink: process.env.ASSET_LINK,
//           domain: process.env.DOMAIN,
//           apiRoute: process.env.API_ROUTE,
//         });
//       }
//     });
// });

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

/** API LIST */

server.post(`${process.env.API_ROUTE}/get-token`, bodyParser.json(), async(req, res) => {
  const API_RESULT = {
    success: true,
    body: {},
  };

  const API_TARGET = `${process.env.SALESFORCE_API}/services/oauth2/token?grant_type=password&client_id=${process.env.SALESFORCE_CLIENT_ID}&client_secret=${process.env.SALESFORCE_CLIENT_SECRET}&password=${process.env.SALESFORCE_TOKEN_PASS}&username=${process.env.SALESFORCE_TOKEN_EMAIL}`;

  fetch(
    API_TARGET,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((oResponse) => oResponse.json())
    .then((data) => {
      if (data.access_token) {
        API_RESULT.body.access_token = data.access_token;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errMessage = 'Authentication failure: Salesforce Token';
      }

      return res.send(API_RESULT);
    });
});

server.post(`${process.env.API_ROUTE}/register-salesforce`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const ACCOUNT_TYPE = req.body.accountType;
  const ACCESS_TOKEN = req.body.accessToken;
  const EMAIL = req.body.email;
  const API_RESULT = {
    success: true,
    body: {},
  };

  const [results] = await database.query(
    'UPDATE `usertable` SET `accountType` = ? WHERE `id` = ?',
    [ACCOUNT_TYPE, USER_ID],
  );

  const ACCOUNT_DETAILS = (ACCOUNT_TYPE === 'candidate') ? {
    FirstName: EMAIL,
    LastName: EMAIL,
    Email: EMAIL,
    AccountId: process.env.SALESFORCE_CANDIDATE_ACCOUNT,
  } : {
    Name: EMAIL,
  };

  const API_TARGET = (ACCOUNT_TYPE === 'candidate') ? `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Contact` : `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Account`;
  fetch(
    API_TARGET,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(ACCOUNT_DETAILS),
    },
  ).then((oResponse) => oResponse.json())
    .then(async(data) => {
      if (data.success === true) {
        await database.query(
          'UPDATE `usertable` SET `salesForceId` = ? WHERE `id` = ?',
          [data.id, USER_ID],
        );
        API_RESULT.body.salesForceId = data.id;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errCode = data[0].errorCode;
        API_RESULT.body.consoleMessage = data[0].message;
        API_RESULT.body.errMessage = `Salesforce Registration Failed: (Account Type - ${ACCOUNT_TYPE})`;
      }

      return res.send(API_RESULT);
    });
});

server.post(`${process.env.API_ROUTE}/sign-up`, bodyParser.json(), async(req, res) => {
  const EMAIL = req.body.email;
  const PASSWORD = req.body.password;
  const API_RESULT = {
    success: true,
    body: {},
  };

  const [results] = await database.query(
    'SELECT * FROM `usertable` WHERE `email` = ?',
    [EMAIL],
  );

  if (results.length > 0) {
    API_RESULT.success = false;
    API_RESULT.body.errMessage = 'An account using that e-mail already exists';
  } else {
    await database.query(
      'INSERT INTO `usertable` (email, password) VALUES (?, ?)',
      [EMAIL, PASSWORD],
    );
    const [results] = await database.query(
      'SELECT * FROM `usertable` WHERE `email` = ?',
      [EMAIL],
    );
    API_RESULT.body.userId = results[0].id;
  }

  return res.send(API_RESULT);
});

server.post(`${process.env.API_ROUTE}/login`, bodyParser.json(), async(req, res) => {
  const EMAIL = req.body.email;
  const PASSWORD = req.body.password;
  const API_RESULT = {
    success: true,
    body: {},
  };

  const [results] = await database.query(
    'SELECT * FROM `usertable` WHERE `email` = ? AND `password` = ?',
    [EMAIL, PASSWORD],
  );

  if (results.length === 0) {
    API_RESULT.success = false;
    API_RESULT.body.errMessage = 'Username or Password is incorrect';
  } else {
    API_RESULT.body.userId = results[0].id;
    API_RESULT.body.email = results[0].email;
    API_RESULT.body.accountType = results[0].accountType;
    API_RESULT.body.salesForceId = results[0].salesForceId;
  }

  return res.send(API_RESULT);
});

server.post(`${process.env.API_ROUTE}/candidate/load`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };

  if (USER_ID === '' || SALESFORCE_ID === '') {
    API_RESULT.success = 401;
    return res.send(API_RESULT);
  }

  const API_TARGET = `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Contact/${SALESFORCE_ID}`;
  fetch(
    API_TARGET,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  ).then((oResponse) => oResponse.json())
    .then((data) => {
      if (data.Id !== undefined) {
        const candidateDetails = data;
        API_RESULT.body.profile = candidateDetails;
        API_RESULT.success = true;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errCode = data[0].errorCode;
        API_RESULT.body.consoleMessage = data[0].message;
        API_RESULT.body.errMessage = 'Salesforce Data Load Failed: (Get Candidate Details)';
      }

      return res.send(API_RESULT);
    });
});

server.post(`${process.env.API_ROUTE}/candidate-work-history/load`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };

  if (USER_ID === '' || SALESFORCE_ID === '') {
    API_RESULT.success = 401;
    return res.send(API_RESULT);
  }

  const workHistoryAPITarget = `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Contact/${SALESFORCE_ID}/Candidate_Work_Experiences__r`;
  fetch(
    workHistoryAPITarget,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  ).then((oResponse) => oResponse.json())
    .then((workHistoryData) => {
      if (workHistoryData.done === true) {
        API_RESULT.body.candidateworkHistory = workHistoryData.records;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errCode = workHistoryData[0].errorCode;
        API_RESULT.body.consoleMessage = workHistoryData[0].message;
        API_RESULT.body.errMessage = 'Salesforce Data Load Failed: (Get Candidate Work History)';
      }

      return res.send(API_RESULT);
    });
});

server.post(`${process.env.API_ROUTE}/candidate/save`, bodyParser.json(), async(req, res) => {
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };
  const CANDIDATE_PROFILE = {
    FirstName: req.body.FirstName || null,
    LastName: req.body.LastName || null,
    Birthdate: req.body.Birthdate || null,
    AccountId: process.env.SALESFORCE_CANDIDATE_ACCOUNT || null,
    MailingStreet: req.body.MailingStreet || null,
    MailingCity: req.body.MailingCity || null,
    MailingState: req.body.MailingState || null,
    MailingPostalCode: req.body.MailingPostalCode || null,
    MailingCountry: req.body.MailingCountry || null,
    Personal_Email__c: req.body.Personal_Email__c || null,
    HomePhone: req.body.HomePhone || null,
  };

  const APITarget = `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Contact/${SALESFORCE_ID}`;
  fetch(
    APITarget,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(CANDIDATE_PROFILE),
    },
  ).then(() => res.send(API_RESULT));
});

server.post(`${process.env.API_ROUTE}/candidate/save-work-history`, bodyParser.json(), async(req, res) => {
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };
  const WORK_HISTORY_ID = req.body.workHistoryId;
  const CANDIDATE_WORK_HISTORY = {
    Contact__c: req.body.Contact__c || null,
    Company__c: req.body.Company__c || null,
    Job_Title__c: req.body.Job_Title__c || null,
    Start_Date__c: req.body.Start_Date__c || null,
    End_Date__c: req.body.End_Date__c || null,
    Description__c: req.body.Description__c || null,
  };

  const APITarget = (WORK_HISTORY_ID) ? `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Candidate_Work_Experience__c/${WORK_HISTORY_ID}` : `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Candidate_Work_Experience__c`;
  const API_METHOD = (WORK_HISTORY_ID) ? 'PATCH' : 'POST';
  fetch(
    APITarget,
    {
      method: API_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(CANDIDATE_WORK_HISTORY),
    },
  ).then((response) => { console.log(response); res.send(API_RESULT); });
});

server.post(`${process.env.API_ROUTE}/company/load`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };

  if (USER_ID === '' || SALESFORCE_ID === '') {
    API_RESULT.success = 401;
    return res.send(API_RESULT);
  }

  const API_TARGET = `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Account/${SALESFORCE_ID}`;
  fetch(
    API_TARGET,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  ).then((oResponse) => oResponse.json())
    .then((data) => {
      if (data.Id !== undefined) {
        API_RESULT.body.profile = data;
        API_RESULT.success = true;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errCode = data[0].errorCode;
        API_RESULT.body.consoleMessage = data[0].message;
        API_RESULT.body.errMessage = 'Salesforce Data Load Failed: (Get Company Details)';
      }

      return res.send(API_RESULT);
    });
});

server.post(`${process.env.API_ROUTE}/company/save`, bodyParser.json(), async(req, res) => {
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };
  const COMPANY_PROFILE = {
    Name: req.body.Name || null,
    Industry: req.body.Industry || null,
    Phone: req.body.Phone || null,
    Website: req.body.Website || null,
    BillingStreet: req.body.BillingStreet || null,
    BillingCity: req.body.BillingCity || null,
    BillingState: req.body.BillingState || null,
    BillingPostalCode: req.body.BillingPostalCode || null,
    BillingCountry: req.body.BillingCountry || null,
    Company_Description__c: req.body.Company_Description__c || null,
  };

  const APITarget = `${process.env.SALESFORCE_API}/services/data/v56.0/sobjects/Account/${SALESFORCE_ID}`;
  fetch(
    APITarget,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(COMPANY_PROFILE),
    },
  ).then(() => {
    res.send(API_RESULT);
  });
});

server.post(`${process.env.API_ROUTE}/job-requirement/load`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };

  if (USER_ID === '' || SALESFORCE_ID === '') {
    API_RESULT.success = 401;
    return res.send(API_RESULT);
  }

  const API_TARGET = `https://kbfcpas--gpc.sandbox.my.salesforce.com/services/data/v56.0/sobjects/Job_Posting__c/a1wEk0000002OFxIAM`;
  fetch(
    API_TARGET,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  ).then((oResponse) => oResponse.json())
    .then((data) => {
      if (data.Id !== undefined) {
        API_RESULT.body.jobDetails = data;
        API_RESULT.success = true;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errCode = data[0].errorCode;
        API_RESULT.body.consoleMessage = data[0].message;
        API_RESULT.body.errMessage = 'Salesforce Data Load Failed: (Get Job Details)';
      }

      return res.send(API_RESULT);
    });
});

server.post(`${process.env.API_ROUTE}/job-requirement/save`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const API_RESULT = {
    success: true,
    body: {},
  };

  const [companyProfile, companyProfileFields] = await database.query(
    'SELECT * FROM `companyprofiletable` WHERE `userId` = ?',
    [USER_ID],
  );

  const companyId = companyProfile[0].id;

  await database.query(
    'UPDATE `jobrequirementtable` SET positionName = ?, jobSummary = ?, jobDescription = ?, qualifications = ?, workingHours = ?, startDate = ? WHERE `companyId` = ? ',
    [req.body.positionName, req.body.jobSummary, req.body.jobDescription, req.body.qualifications, req.body.workingHours, req.body.startDate || '2024-01-01', companyId],
  );

  return res.send(API_RESULT);
});

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

server.post(`${process.env.API_ROUTE}/candidate-list/load`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const API_RESULT = {
    success: true,
    body: {},
  };

  if (USER_ID === '') {
    API_RESULT.success = 401;
    return res.send(API_RESULT);
  }

  const [candidates, candidatesFields] = await database.query(
    'SELECT * FROM `candidateprofiletable`',
  );

  API_RESULT.body.candidates = candidates;

  return res.send(API_RESULT);
});

server.post(`${process.env.API_ROUTE}/job-list/load`, bodyParser.json(), async(req, res) => {
  const USER_ID = req.body.userId;
  const SALESFORCE_ID = req.body.salesForceId;
  const ACCESS_TOKEN = req.body.accessToken;
  const API_RESULT = {
    success: true,
    body: {},
  };

  if (USER_ID === '' || SALESFORCE_ID === '') {
    API_RESULT.success = 401;
    return res.send(API_RESULT);
  }

  const API_TARGET = `https://kbfcpas--gpc.sandbox.my.salesforce.com/services/data/v56.0/sobjects/Job_Posting__c/a1wEk0000002OFxIAM`;
  fetch(
    API_TARGET,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  ).then((oResponse) => oResponse.json())
    .then((data) => {
      if (data.Id !== undefined) {
        API_RESULT.body.jobs = [data, data, data, data];
        API_RESULT.success = true;
      } else {
        API_RESULT.success = false;
        API_RESULT.body.errCode = data[0].errorCode;
        API_RESULT.body.consoleMessage = data[0].message;
        API_RESULT.body.errMessage = 'Salesforce Data Load Failed: (Get Job Details)';
      }

      return res.send(API_RESULT);
    });
});
