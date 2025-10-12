({
  access: 'public',

  
  method: async ({ accountId, subscriptionId }) => {
    console.info('api/subscription/cancel');
    console.debug({ accountId, subscriptionId });

    try {
      const [lastPayment] = await db.pg.select('SubPayment', { subscriptionId }).desc('date').limit(1);
      const { tg: user_id } = await db.pg.row('Account', { accountId });
      await db.pg.update('Subscription', { isCancelled: true }, { subscriptionId });

      const { paymentData: { telegram_payment_charge_id } } = lastPayment;
      await bus.bot.editUserStarSubscription({ user_id, telegram_payment_charge_id, is_cancelled: true });
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})