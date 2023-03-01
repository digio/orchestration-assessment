const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const { getTemporalWorkflowClient } = require('../orchestration/client');

const { SIGNAL, CONFIG } = require('../constants');

async function completeConductorManualTask(workflowInstanceId, taskId) {
  try {
    const body = {
      workflowInstanceId,
      taskId,
      status: 'COMPLETED'
    }
    const url = `${CONFIG.CONDUCTOR_SERVER_BASE_URL}/api/tasks`;
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
    console.log('Error received when trying to complete the manual approval task', err);
  }
}

async function completeTemporalManualTask(workflowInstanceId) {
  const handle = (await getTemporalWorkflowClient()).getHandle(workflowInstanceId);

  await handle.signal(SIGNAL.MANUAL_APPROVAL_UNBLOCK);
}

router.get('/', function(req, res) {
  console.log('Low score approved request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.userName;
  const credit = req.query.credit;
  const workflowInstanceId = req.query.workflowInstanceId;
  const taskId = req.query.taskId;

  console.log('Marking manual task as complete to continue card application process: ', { workflowInstanceId, taskId });

  if (process.env.ORCHESTRATION_TOOL === 'conductor') {
    completeConductorManualTask(workflowInstanceId, taskId).then((response) => {
      console.log('Manual task marked as complete successfully: ', workflowInstanceId, taskId, response);
    });
  } else {
    completeTemporalManualTask(workflowInstanceId).then(() => {
      console.log('Manual task marked as complete successfully: ', workflowInstanceId);
    });
  }

  res.render('low-score-approved', {
    userName,
    credit
  });
});

module.exports = router;
