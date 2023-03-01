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
