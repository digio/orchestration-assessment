var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('Low score approval request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.name;
  const credit = req.query.credit;
  const workflowInstanceId = req.query.workflowInstanceId;
  const taskId = req.query.taskId;

  const url = `/low-score-approved?workflowInstanceId=${workflowInstanceId}&taskId=${taskId}&userName=${userName}&credit=${credit}`;

  res.render('low-score-approval', { 
    userName,
    credit,
    url
  });
});

module.exports = router;
