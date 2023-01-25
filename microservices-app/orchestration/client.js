var { Connection, Client, WorkflowClient } = require('@temporalio/client');
var workflow = require('./workflow');

async function startWorkflow(userName, email, credit) {
  console.log('Starting new client workflow execution', { userName, email, credit });
  try {
    // TODO fix docker connection not working
    // const connectionOptions = {
    //   address: 'temporal-host:7233',
    //   // address: 'temporal:7233',
    // };
    // const connection = await Connection.connect(connectionOptions);
    // const client = new Client({ connection });
    const client = new Client();
    console.log('New client connection established');
    const result = await client.workflow.execute(workflow.creditCardWorkflow, {
      taskQueue: 'credit-card-app-queue',
      workflowId: 'credit-card-workflow',
      args: [{ userName, email, credit }],
    });
    console.log('Workflow execution finished', result);
  } catch (err) {
    console.error('Error occurred when executing the workflow', err);
    process.exit(1);
  }
}

module.exports = startWorkflow;
