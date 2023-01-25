var { Worker, NativeConnection } = require('@temporalio/worker');
var activities = require('./activities');

async function run() {
  // TODO fix docker connection not working
  // const connectionOptions = {
  //   address: 'temporal-host:7233',
  //   // address: 'temporal:7233',
  // };
  // const connection = await NativeConnection.connect(connectionOptions);
  const worker = await Worker.create({
    // connection,
    workflowsPath: require.resolve('./workflow'),
    activities,
    taskQueue: 'credit-card-app-queue',
  });

  await worker.run();
}

run().catch((err) => {
  console.error('Error occurred when executing the worker', err);
  process.exit(1);
});
