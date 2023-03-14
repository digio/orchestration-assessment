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

router.post('/', function(req, res, next) {
  console.log('Notification to banker about need for manual approval request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.body.name;
  const credit = req.body.credit;
  const crmId = req.body.id;
  const workflowInstanceId = req.body.workflowInstanceId;
  const taskId = req.body.taskId;

  const recipientAddresses = '"Banker" <banker@bank.com>';
  const subject = 'Low Credit Approval Required';
  const header = 'A New Credit Card Check Resulted in Low Credit for New Customer';
  const paragraph = `Manual approval is required due to low credit score. Once manual verification for customer with CRM ID: ${crmId} is satisfactory, please follow below link to approve the provisioning of a new credit card with a limit of ${credit} for customer ${userName}.`;
  const customHtml = `
    <a href="http://localhost:4000/low-score-approval?workflowInstanceId=${workflowInstanceId}&taskId=${taskId}&userName=${userName}&credit=${credit}">
      Link for manual approval
    </a>
  `;

  sendEmail(recipientAddresses, subject, header, paragraph, customHtml).then((response) => {
    console.log('Email notification sent to banker for manual approval: ', response);
  });

  res.send(`Notifying banker that manual approval for credit of ${credit} is required for user: ${userName} with id: ${crmId}`);
});


module.exports = router;
