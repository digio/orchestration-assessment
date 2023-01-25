var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('Credit upselling request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.name;
  const crmId = req.query.id;
  const credit = req.query.credit;
  res.send(`Credit upselling recommendation issued for user: ${userName} with id: ${crmId} for credit of ${credit}`);
});


module.exports = router;
