var express = require('express');
var router = express.Router();
var sendEmail = require('../services/notificationService');

router.post('/', function (req, res, next) {
  console.log('New credit card provisioned request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.body.name;
  const credit = req.body.credit;
  const crmId = req.body.id;
  const email = req.body.email;

  const recipientAddresses = `"Customer" <${email}>`;
  const subject = 'New Credit Card Provisioned';
  const header = `${userName}, you have a new credit card was provisioned for you`;
  const paragraph = `We have successfully provisioned and issued a new credit card with a limit of ${credit}.
  It is expected to arrive in 5-10 business days so stay tuned!`;

  sendEmail(recipientAddresses, subject, header, paragraph).then((response) => {
    console.log('Email notification sent to customer: ', response);
  });

  res.send(`New credit card with credit of ${credit} provisioned for user: ${userName} with id: ${crmId}`);
});


module.exports = router;
