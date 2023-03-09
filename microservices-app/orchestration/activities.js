const { Context } = require('@temporalio/activity');
const fetch = require('node-fetch');

const { CONFIG } = require('../constants');

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function unwrapResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

async function requestCrmProfileCreation(name) {
  const params = new URLSearchParams({ name });
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/crm`

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
    });
    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity requestCrmProfileCreation', err);
    throw err;
  }
}

async function initiateCreditCheck({ name, crmId, credit }) {
  const params = new URLSearchParams({
    name,
    id: crmId,
    credit,
    isLongPolling: true,
  });
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/check`

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
    });
    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity initiateCreditCheck', err);
    throw err;
  }
}

async function updateCrmProfile({ name, email, credit }) {
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/crm`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ name, email, credit })
    });
    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity updateCrmProfile', err);
    throw err;
  }
}

async function notifyCustomerOfUpsell({ name, crmId, credit }) {
  const params = new URLSearchParams({ name, id: crmId, credit });
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/upsell`

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
    });
    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity notifyCustomerOfUpsell', err);
    throw err;
  }
}

async function notifyCustomerOfProvisionedCreditCard({ name, email, credit }) {
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/provisioned`

  try {
    const { runId } = Context.current().info.workflowExecution;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        credit,
        id: runId
      }),
      headers: defaultHeaders
    });
    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity notifyCustomerOfProvisionedCreditCard', err);
    throw err;
  }
}

async function notifyBankerOfProvisionedCreditCard({ name, credit }) {
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/notify`

  try {
    const { runId } = Context.current().info.workflowExecution;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name,
        credit,
        id: runId
      }),
      headers: defaultHeaders
    });

    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity notifyBankerOfProvisionedCreditCard', err);
    throw err;
  }
}

async function notifyBankerOfManualApprovalRequired({ name, credit, crmId }) {
  const url = `${CONFIG.MICROSERVICES_BASE_URL}/manual-approval`

  try {
    const { runId, workflowId } = Context.current().info.workflowExecution;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name,
        credit,
        id: crmId,
        workflowInstanceId: workflowId,
        taskId: runId,
      }),
      headers: defaultHeaders
    });

    return unwrapResponse(response);
  } catch (err) {
    console.log('Error received when executing activity notifyBankerOfManualApprovalRequired', err);
    throw err;
  }
}

module.exports = {
  requestCrmProfileCreation,
  updateCrmProfile,
  initiateCreditCheck,
  notifyCustomerOfUpsell,
  notifyCustomerOfProvisionedCreditCard,
  notifyBankerOfProvisionedCreditCard,
  notifyBankerOfManualApprovalRequired,
};
