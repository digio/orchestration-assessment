const { Connection, Client } = require('@temporalio/client');
const workflow = require('./workflow');
const { v4: uuid } = require('uuid');

async function startWorkflow(userName, email, credit) {
  console.log('Starting new client workflow execution', { userName, email, credit });

  const connection = await Connection.connect();
  const client = new Client({ connection });

  const handle = await client.workflow.start(workflow.creditCardWorkflow, {
    taskQueue: 'credit-card-app-queue',
    workflowId: `credit-card-workflow_${uuid()}`,
    args: [{ userName, email, credit }],
  });

  try {
    console.log('New client connection established', handle);

    const result = await handle.result();

    console.log('Workflow execution finished', result);

  } catch (err) {
    console.error('Error occurred when executing the workflow', err);
    process.exit(1);
  }
}

module.exports = startWorkflow;
