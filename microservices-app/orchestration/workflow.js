const wf = require('@temporalio/workflow');

const { CREDIT_CHECK_SCORE, SIGNAL } = require('../constants');

const {
  requestCrmProfileCreation,
  updateCrmProfile,
  notifyCustomerOfUpsell,
  notifyCustomerOfProvisionedCreditCard,
  notifyBankerOfProvisionedCreditCard,
} = wf.proxyActivities({
  startToCloseTimeout: '1 minute',
});

const {
  initiateCreditCheck,
} = wf.proxyActivities({
  startToCloseTimeout: '1 minute',
  heartbeatTimeout: 60_000,
  retry: {
    maximumAttempts: 5,
  },
});

const {
  notifyBankerOfManualApprovalRequired,
} = wf.proxyActivities({
  startToCloseTimeout: '1 hour',
});

const manualApprovalUnblock = wf.defineSignal(SIGNAL.MANUAL_APPROVAL_UNBLOCK);

/**
 * Creates a signal used to pause the workflow while the manual approval process
 * is in place for customers with a low credit score.
 * @see https://typescript.temporal.io/api/namespaces/workflow#signals-and-queries
 *
 * @returns {Promise<void>}
 */
async function waitForManualApproveUnblock() {
  let isBlocked = true;

  wf.setHandler(manualApprovalUnblock, () => void (isBlocked = false));

  try {
    await wf.condition(() => !isBlocked);
    isBlocked = true;
  } catch (err) {
    if (!(err instanceof wf.CancelledFailure)) {
      throw err;
    }
    console.log('Manual approval cancelled');
  }
}

async function creditCardWorkflow({ userName: name, email, credit }) {
  console.log('Starting new workflow execution', { name, email, credit });

  //  Create profile in CRM
  console.log('\n\n🤘 STEP: CREATE USER PROFILE');
  const crmId = (await requestCrmProfileCreation(name)).id;

  //  Initiate polling to credit check API
  console.log('\n\n🤘 STEP: INITIATE CREDIT CHECK (polling)');
  const creditScore = (await initiateCreditCheck({ crmId, name, credit })).result;

  //  Low credit score means a manual approval of the application
  //  is required. This step should send an email containing
  //  workflowId and runId and await the response of the banker
  if (creditScore === CREDIT_CHECK_SCORE.LOW) {
    console.log('\n\n🤘 STEP: MANUAL APPROVAL OF APPLICATION');
    await notifyBankerOfManualApprovalRequired({ crmId, name, credit });

    //  Awaits manual intervention from email sent to banker with timeout of 1 hour
    await waitForManualApproveUnblock();

  //  High credit score means we can attempt to up-sell a higher limit
  //  because this will essentially make us more money in the long run
  } else if (creditScore === CREDIT_CHECK_SCORE.HIGH) {
    console.log('\n\n🤘 STEP: UPDATE CRM WITH UPSELL OPPORTUNITY');
    await notifyCustomerOfUpsell({ crmId, name, credit });
  }

  //  Update profile in CRM with the credit score
  console.log('\n\n🤘 STEP: UPDATE USER PROFILE IN CRM WITH CREDIT LIMIT');
  await updateCrmProfile({ name, email, credit });

  //  Notify customer and banker of provisioned credit card
  console.log('\n\n🤘 STEP: NOTIFY BANKER AND CUSTOMER');
  await Promise.all([
    notifyCustomerOfProvisionedCreditCard({ name, email, credit }),
    notifyBankerOfProvisionedCreditCard({ name, credit }),
  ]);

  return Promise.resolve();
}

module.exports = { creditCardWorkflow };
