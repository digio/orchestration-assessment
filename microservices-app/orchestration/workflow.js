var wf = require('@temporalio/workflow');

const { requestCrmProfileCreation } = wf.proxyActivities({
  startToCloseTimeout: '1 minute',
});

async function creditCardWorkflow({ userName, email, credit }) {
  console.log('Starting new workflow execution', { userName, email, credit });
  const result = await requestCrmProfileCreation(userName);

  // TODO add the rest of the workflow here

  console.log('Workflow execution result', result);
  return result;
}

module.exports = { creditCardWorkflow };
