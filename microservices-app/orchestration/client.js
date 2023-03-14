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

const { Connection, Client, WorkflowClient, Workflow, WorkflowResultType } = require('@temporalio/client');
const { v4: uuid } = require('uuid');
const isDocker = require('is-docker');

const { CONFIG } = require('../constants');

let connection;

/**
 * Client connection to the Temporal Server
 * @see https://typescript.temporal.io/api/classes/client.Connection
 *
 * @returns {Promise<ReturnType<Connection>>}
 */
async function getConnection() {
  if (!connection) {
    connection = Connection.connect(isDocker() ? {
      address: CONFIG.TEMPORAL_SERVER_ADDRESS
    } : undefined);
  }

  return connection;
}

/**
 * Client for starting Workflow executions and creating Workflow handles.
 * @see https://typescript.temporal.io/api/classes/client.WorkflowClient
 *
 * @returns {Promise<WorkflowClient>}
 */
async function getTemporalWorkflowClient() {
  const connection = await getConnection();

  return new WorkflowClient({ connection });
}

/**
 * Client for communicating with Temporal Server.
 * @see https://typescript.temporal.io/api/namespaces/client
 *
 * @param workflowToRun
 * @param params
 * @returns {Promise<WorkflowResultType<Workflow>>}
 */
async function run(workflowToRun, params) {
  console.log('Starting new client workflow execution', params);
  const connection = await getConnection();
  const client = new Client({ connection });

  try {
    const handle = await client.workflow.start(workflowToRun, {
      taskQueue: CONFIG.TEMPORAL_TASK_QUEUE,
      workflowId: `${CONFIG.TEMPORAL_WORKFLOW_ID_PREFIX}_${uuid()}`,
      args: [params],
    });

    const result = await handle.result();
    console.log('Workflow execution finished', result);
    return result;
  } catch (err) {
    console.error('Error occurred when executing the workflow', err);
    process.exit(1);
  }
}

module.exports = { run, getTemporalWorkflowClient };
