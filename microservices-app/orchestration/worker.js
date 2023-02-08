const { Worker, NativeConnection } = require('@temporalio/worker');
const isDocker = require('is-docker');

const activities = require('./activities');
const { CONFIG } = require('../constants');

/**
 * The temporal worker connects to the service and runs workflows and activities.
 *
 * @see https://typescript.temporal.io/api/namespaces/worker
 * @returns {Promise<void>}
 */
async function run() {
  const connection = await NativeConnection.connect(isDocker() ? {
    address: CONFIG.TEMPORAL_SERVER_ADDRESS,
  } : undefined);

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve('./workflow'),
    activities,
    taskQueue: CONFIG.TEMPORAL_TASK_QUEUE,
  });

  await worker.run();
}

run().catch((err) => {
  console.error('Error occurred when executing the worker', err);
  process.exit(1);
});
