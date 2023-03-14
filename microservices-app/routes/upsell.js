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

router.get('/', function(req, res, next) {
  console.log('Credit upselling request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.name;
  const crmId = req.query.id;
  const credit = req.query.credit;
  res.send(`Credit upselling recommendation issued for user: ${userName} with id: ${crmId} for credit of ${credit}`);
});


module.exports = router;
