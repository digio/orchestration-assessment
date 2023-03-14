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

const express = require('express');
const fetch = require('node-fetch');

const { CONFIG } = require('../constants');

const router = express.Router();

function startTemporalApplicationWorkflow(userName, email, credit) {
  const params = { userName, email, credit };
  const { run } = require('../orchestration/client');
  const { creditCardWorkflow } = require('../orchestration/workflow');

  return run(creditCardWorkflow, params);
}

async function startConductorApplicationWorkflow(userName, email, credit) {
  try {
    const body = {
      name: userName,
      email,
      credit
    }
    const url = `${CONFIG.CONDUCTOR_SERVER_BASE_URL}/api/workflow/new_credit_card_application`;
    const params = {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    };
    console.log('Calling', url, params);
    const response = await fetch(url, params);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error received when trying to initiate the application workflow', err);
  }
}

async function startApplicationWorkflow(userName, email, credit) {
  if (process.env.ORCHESTRATION_TOOL === 'conductor') {
    console.log('Starting Conductor workflow');
    return await startConductorApplicationWorkflow(userName, email, credit);
  } else if (process.env.ORCHESTRATION_TOOL === 'temporal') {
    console.log('Starting Temporal workflow');
    return await startTemporalApplicationWorkflow(userName, email, credit);
  }

  throw new Error('ORCHESTRATION_TOOL not provided as environment variable or invalid');
}

router.post('/', function (req, res) {
  console.log('Form submitted with request: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);

  startApplicationWorkflow(req.body.name, req.body.email, req.body.credit).then((response) => {
    console.log('Application workflow initialisation response: ', response);
  });

  res.render('submitted', { msg: 'Application submitted successfully.' });
})


module.exports = router;
