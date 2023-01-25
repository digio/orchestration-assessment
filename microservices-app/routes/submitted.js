var express = require('express');
var fetch = require('node-fetch');
var startWorkflow = require('../orchestration/client');
var router = express.Router();

async function startTemporalApplicationWorkflow(userName, email, credit) {
  await startWorkflow(userName, email, credit);
}

async function startConductorApplicationWorkflow(userName, email, credit) {
  try {
    const body = {
      name: userName,
      email,
      credit
    }
    const url = `http://${process.env.CONDUCTOR_HOST}:8080/api/workflow/new_credit_card_application`;
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
  }
  console.log('Starting Temporal workflow');
  return await startTemporalApplicationWorkflow(userName, email, credit);
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
