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

const CREDIT_CHECK_SCORE = {
    HIGH: 'High Credit',
    ACCEPTABLE: 'Acceptable Credit',
    LOW: 'Low Credit',
};

const SIGNAL = {
    MANUAL_APPROVAL_UNBLOCK: 'manual-approval-unblock',
};

const CONFIG = {
    CONDUCTOR_SERVER_BASE_URL: 'http://conductor-server:8080',
    MICROSERVICES_BASE_URL: 'http://express-app-host:4000',
    TEMPORAL_SERVER_ADDRESS: 'temporal:7233',
    TEMPORAL_TASK_QUEUE: 'credit-card-app-queue',
    TEMPORAL_WORKFLOW_ID_PREFIX: 'credit-card-workflow',
};

module.exports = {
    CREDIT_CHECK_SCORE,
    SIGNAL,
    CONFIG,
};
