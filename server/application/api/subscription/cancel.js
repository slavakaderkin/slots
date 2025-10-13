({
  access: 'public',

  
  method: async ({ accountId, subscriptionId, refund = false }) => {
    console.info('api/subscription/cancel');
    console.debug({ accountId, subscriptionId, refund });

    try {
      const [lastPayment] = await db.pg.select('SubPayment', { subscriptionId }).desc('subPaymentId').limit(1);
      const { tg: user_id } = await db.pg.row('Account', { accountId });
     
      
      const { paymentData: { telegram_payment_charge_id } } = lastPayment;
      const args = { user_id, telegram_payment_charge_id, is_canceled: true }
      const { result, ok } = await bus.bot.editUserStarSubscription(args);

      if (ok && result) await db.pg.update('Subscription', { isCancelled: true }, { subscriptionId });
      if (refund) await domain.subscription.refundPayment({ subPaymentId: lastPayment.subPaymentId });
     
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})