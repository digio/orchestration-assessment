const { v4: uuidv4 } = require('uuid')
var express = require('express');
var router = express.Router();

/**
 * Do note that this is a mock and will give you a new UUID
 * every time. There is no need to keep the same UUID for
 * the exercise of the POC as of yet. In fact, the new UUID
 * helps with testing for now.
 */

router.get('/', function (req, res, next) {
  console.log('CRM user creation request received', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.name;
  const crmId = uuidv4();
  console.log(`CRM entry with id ${crmId} created for user: ${userName}`);
  res.send({
    name: userName,
    id: crmId
  });
});

router.put('/', function (req, res, next) {
  console.log('CRM user creation request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.body.name;
  const crmId = req.body.id;
  const credit = req.body.credit;
  console.log(`CRM user ${userName} with id ${crmId} has been flagged for upsell beyond requested credit ${credit}`);
  res.send(`CRM user ${userName} with id ${crmId} has been flagged for upsell beyond requested credit ${credit}`);
});


module.exports = router;
