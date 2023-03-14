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
