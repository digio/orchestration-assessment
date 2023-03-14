// Copyright 2023 Mantel Group Pty Ltd

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//    http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 2525,
  host: 'smtp.mailtrap.io',
  auth: {
    user: process.env.POC_EMAIL_USER,
    pass: process.env.POC_EMAIL_PASS,
  },
});

function curateEmail(recipientAddresses, subject, header, paragraph, customHtml) {
  const mailHtml = `
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
          <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">${header}</h1>
          <p>${paragraph}</p>
          ${customHtml || ''}
        </div>
      </body>
    </html>
  `;
  const emailParams = {
    from: '"POC Orchestration" <poc@orchestration.com>',  // sender address
    to: recipientAddresses,   // list of receivers
    subject,
    html: mailHtml,
  };
  return emailParams;
}

const sendEmail = async (recipientAddresses, subject, header, paragraph, customHtml) => {
  const emailParams = curateEmail(recipientAddresses, subject, header, paragraph, customHtml);
  console.log(`Sending email: `, emailParams);
  return transporter.sendMail(emailParams).catch((err) => {
    console.log(`Error when sending email to ${recipientAddresses}: `, err);
  });
}

module.exports = sendEmail;
