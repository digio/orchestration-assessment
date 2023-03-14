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

var express = require('express');
var router = express.Router();
var sendEmail = require('../services/notificationService');

router.post('/', function (req, res, next) {
  console.log('Notification to banker request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.body.name;
  const credit = req.body.credit;
  const crmId = req.body.id;

  console.log('USERNAME', req.body.name);
  console.log('CREDIT', req.body.credit);
  console.log('ID', req.body.id);

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
