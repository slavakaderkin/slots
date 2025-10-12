({
  async cancelTrial({ trialId }) {
    console.info('domain/subscription/cancelTrial');
    console.debug({ trialId });

    const [trial] = await db.pg.update('Trial', { isActive: false }, { trialId });
    const { accountId } = trial;
    const subscription = await db.pg.row('Subscription', { accountId });

    if (!subscription?.isActive) {
      const messagePath = 'subscription.trialExpired';
      lib.bot.notify.one({ accountId, path: messagePath });
    }
  },

  async cancel({ subscriptionId }) {
    console.info('domain/subscription/cancel');
    console.debug({ subscriptionId });

    const [subscription] = await db.pg.update('Subscription', { isActive: false }, { subscriptionId });
    const { accountId } = subscription;
    const messagePath = 'subscription.expired';
    lib.bot.notify.one({ accountId, path: messagePath });
  },

  async byAccount({ accountId }) {
    console.info('domain/subscription/byAccount');
    console.debug({ accountId });

    const subscription = await db.pg.row('Subscription', { accountId });
    if (subscription) {
      const { subscriptionId } = subscription;
      const [lastPayment, ...payments] = await db.pg.select('SubPayment', { subscriptionId }).desc('date');
      subscription['payments'] = [lastPayment, ...payments];
      subscription['lastPayment'] = lastPayment;
    }

    const trial = await db.pg.row('Trial', { accountId });
    return { subscription, trial };
  }
});