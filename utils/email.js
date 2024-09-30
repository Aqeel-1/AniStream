/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  // Create a transporter
  const Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
  });
  // define the email option
  const mailOptions = {
    from: 'Aqeel <aqeel@aqeel.io>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  // actually send the email
  await Transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
