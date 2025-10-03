async () => {
  console.info('lib/jobs/subscriptionsCancel');

  const query = lib.pg.queries.jobs.subscriptionsCancel();
  const subscriptions = await lib.pg.builder.query(query);
  for (const { subscriptionId } of subscriptions) {
    domain.subscription.cancel({ subscriptionId })
  }
}