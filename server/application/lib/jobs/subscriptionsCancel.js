async () => {
  console.info('lib/jobs/subscriptionsCancel');

  const subsQuery = lib.pg.queries.jobs.subscriptionsCancel();
  const subscriptions = await lib.pg.builder.query(subsQuery);
  for (const { subscriptionId } of subscriptions) {
    domain.subscription.cancel({ subscriptionId })
  }

  const trialsQuery = lib.pg.queries.jobs.trialsCancel();
  const trials = await lib.pg.builder.query(trialsQuery);
  for (const { trialId } of trials) {
    domain.subscription.cancelTrial({ trialId })
  }
}