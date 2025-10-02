/* eslint-disable camelcase */
async ({ chat, message, id, args }) => {
  console.info('lib/bot/callbacks/payment/refund');
  console.debug({ chat, message, id, args });

  try {
    const { subPaymentId } = args;
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

    const answer = {
      callback_query_id: id,
      text: 'Платеж возвращен',
      show_alert: true,
    };

    await lib.bot.wrappers.answerCallback(answer);
    return true; // false если не надо удалять исходное сообщение
  } catch (e) {
    console.error(e);
    return false;
  }
};