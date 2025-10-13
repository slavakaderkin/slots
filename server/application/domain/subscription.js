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
  },

  async refundPayment({ subPaymentId }) {
    console.info('domain/subscription/refundPayment');
    console.debug({ subPaymentId });

    const payment = await db.pg.row('SubPayment', { subPaymentId });

    if (payment?.state !== 'refunded') {
      const { subscriptionId, paymentData, type } = payment;
      const subscription = await db.pg.row('Subscription', { subscriptionId });
      const { accountId } = subscription;
      const { tg: user_id } = await db.pg.row('Account', { accountId })
      const { telegram_payment_charge_id } = paymentData;
  
      const days = type === 'month' ? 30 : 365;
      const { end: currentEnd } = subscription;
      const end = lib.utils.modTime(currentEnd, -days, 'd');
      const isActive = new Date(end) > new Date();
      await db.pg.update('Subscription', { end, isActive }, { subscriptionId });
      await db.pg.update('SubPayment', { state: 'refunded' }, { subPaymentId });
  
      await bus.bot.refundStarPayment({ telegram_payment_charge_id, user_id });
    }

  }
});