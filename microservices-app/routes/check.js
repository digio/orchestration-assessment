var fs = require('fs');
var express = require('express');
var router = express.Router();

const MAX_WAIT = 100000; // milliseconds

function updateCrmMock(resultHash) { // using a basic file in the docker image
  let result = Math.random() < 0.5 ? 'Acceptable Credit' : 'Low Credit';
  result = Math.random() < 0.2 ? 'High Credit' : result; // lower probability of high credit
  const filename = `${resultHash}.txt`;
  console.log(`Writing result of ${result} has been written to file ${filename}`);
  fs.writeFileSync(filename, result, { encoding: 'utf8', flag: 'w' }); // will overwrite every time
  console.log(`Result of ${result} has been written to file ${filename}`);
}

function mockCreditCheck(resultHash) {
  console.log(`Mocking credit check with random timer of up to ${MAX_WAIT / 1000} seconds`);
  const waitTime = Math.random() * 100000;
  console.log(`Wait time is ${waitTime / 1000} seconds`);
  setTimeout(() => updateCrmMock(resultHash), waitTime);
}

function getCheckResult(resultHash) {
  const filename = `${resultHash}.txt`;
  let result;
  try {
    result = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
  } catch (err) {
    console.log(`File ${filename} does not exist yet`);
    return '';
  }
  console.log(`Result of ${result} has been read from file ${filename}`);
  return result;
}

function getFilename(userName, crmId) {
  return userName + '_' + crmId;
}

router.get('/', function (req, res, next) {
  console.log('Credit check request received: ', { query: req.query, body: req.body });
  // console.debug('Full request received: ', req);
  const userName = req.query.name;
  const crmId = req.query.id;
  const creditRequest = req.query.credit;
  const resultHash = getFilename(userName, crmId);
  const result = getCheckResult(resultHash);
  if (result) {
    res.send({
      name: userName,
      id: crmId,
      credit: creditRequest,
      result
    });
  } else {
    res.status(404).send(`Credit check of ${creditRequest} in progress for user: ${userName} with id: ${crmId}. Please keep polling until it is done`);
    mockCreditCheck(resultHash);
  }
});


module.exports = router;
