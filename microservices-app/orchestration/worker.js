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
