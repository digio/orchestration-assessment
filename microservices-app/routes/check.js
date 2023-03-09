const fs = require('fs');
const express = require('express');
const router = express.Router();

const { CREDIT_CHECK_SCORE } = require('../constants');

const MAX_WAIT_MS = 40_000; // milliseconds
const HEARTBEAT_TIMEOUT_MS = 1000;
const MS_IN_A_SEC = 1000;

function updateCrmMock(resultHash) { // using a basic file in the docker image
  let result = Math.random() < 0.5 ? CREDIT_CHECK_SCORE.ACCEPTABLE : CREDIT_CHECK_SCORE.LOW;
  result = Math.random() < 0.2 ? CREDIT_CHECK_SCORE.HIGH : result; // lower probability of high credit
  const filename = `${resultHash}.txt`;
  console.log(`Writing result of ${result} has been written to file ${filename}`);
  fs.writeFileSync(filename, result, { encoding: 'utf8', flag: 'w' }); // will overwrite every time
  console.log(`Result of ${result} has been written to file ${filename}`);
}

function mockCreditCheck(resultHash) {
  console.log(`Mocking credit check with random timer of up to ${MAX_WAIT_MS / MS_IN_A_SEC} seconds`);
  const waitTime = Math.random() * MAX_WAIT_MS;
  console.log(`Wait time is ${waitTime / MS_IN_A_SEC} seconds`);
  setTimeout(() => updateCrmMock(resultHash), waitTime);
}

function getCheckResult(resultHash) {
  const filename = `${resultHash}.txt`;
  let result;
  try {
    result = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
  } catch (err) {
    console.log(`File ${filename} does not exist yet`);
    return null;
  }
  console.log(`Result of ${result} has been read from file ${filename}`);
  return result;
}

function getFilename(userName, crmId) {
  return userName + '_' + crmId;
}

async function waitForProfileCreation(resultHash, currentTime = 0) {
  const profileResult = getCheckResult(resultHash);

  if (profileResult) {
    return profileResult;
  }

  if (currentTime >= MAX_WAIT_MS) {
    return false;
  }

  await new Promise((resolve) => setTimeout(() => resolve(true), HEARTBEAT_TIMEOUT_MS));

  return waitForProfileCreation(resultHash, currentTime + HEARTBEAT_TIMEOUT_MS);
}

router.get('/', async function (req, res) {
  console.log('Credit check request received: ', { query: req.query, body: req.body });

  const {
    name,
    id,
    credit,
    isLongPolling
  } = req.query;

  const resultHash = getFilename(name, id);
  let result = getCheckResult(resultHash);

  if (!result) {
    mockCreditCheck(resultHash);

    if (isLongPolling === 'true') {
      result = await waitForProfileCreation(resultHash);
    } else {
      res.status(404).send(`Credit check of ${credit} in progress for user: ${name} with id: ${id}. Please keep polling until it is done`);

      return;
    }
  }

  res.send({
    name,
    id,
    credit,
    result
  });
});


module.exports = router;
