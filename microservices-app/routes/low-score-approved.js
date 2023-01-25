var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

async function completeConductorManualTask(workflowInstanceId, taskId) {
  try {
    const body = {
      workflowInstanceId,
      taskId,
      status: 'COMPLETED'
    }
    const url = `http://${process.env.CONDUCTOR_HOST}:8080/api/tasks`;
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

router.get('/', function (req, res, next) {
  console.log('Low score approved request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.name;
  const credit = req.query.credit;
  const workflowInstanceId = req.query.workflowInstanceId;
  const taskId = req.query.taskId;

  console.log('Marking manual task as complete to continue card application process: ', { workflowInstanceId, taskId });
  completeConductorManualTask(workflowInstanceId, taskId).then((response) => {
    console.log('Manual task marked as complete successfully: ', workflowInstanceId, taskId, response);
  });

  res.render('low-score-approved', {
    userName,
    credit
  });
});

module.exports = router;
