const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const sendMail = async function() {
    await transporter.sendMail({
      from: '"Kenneth Azura" <kenneth.azura@gmail.com>', // sender address
      to: 'kenneth.azura@gmail.com', // list of receivers
      subject: 'GPC - Contact Us Form', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });
  };
}

main().catch(console.error);
