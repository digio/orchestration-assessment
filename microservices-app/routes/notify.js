var express = require('express');
var router = express.Router();
var sendEmail = require('../services/notificationService');

router.post('/', function (req, res, next) {
  console.log('Notification to banker request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.body.name;
  const credit = req.body.credit;
  const crmId = req.body.id;

  const recipientAddresses = '"Banker" <banker@bank.com>';
  const subject = 'New Credit Card Provisioned';
  const header = 'A New Credit Card Provisioned for New Customer';
  const paragraph = `We have successfully provisioned and issued a new credit card with a limit of ${credit} for customer ${userName}.
  Please log in to CRM to track it. New customer CRM profile ID: ${crmId}`;

  sendEmail(recipientAddresses, subject, header, paragraph).then((response) => {
    console.log('Email notification sent to banker for credit card provisioning: ', response);
  });

  res.send(`Notifying banker that card with credit of ${credit} was provisioned for user: ${userName} with id: ${crmId}`);
});


module.exports = router;
