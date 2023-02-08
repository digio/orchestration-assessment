const CREDIT_CHECK_SCORE = {
    HIGH: 'High Credit',
    ACCEPTABLE: 'Acceptable Credit',
    LOW: 'Low Credit',
};

const SIGNAL = {
    MANUAL_APPROVAL_UNBLOCK: 'manual-approval-unblock',
};

const CONFIG = {
    MICROSERVICES_BASE_URL: 'http://localhost:4000',
    TEMPORAL_SERVER_ADDRESS: 'temporal:7233',
    TEMPORAL_TASK_QUEUE: 'credit-card-app-queue',
    TEMPORAL_WORKFLOW_ID_PREFIX: 'credit-card-workflow',
};

module.exports = {
    CREDIT_CHECK_SCORE,
    SIGNAL,
    CONFIG,
};
