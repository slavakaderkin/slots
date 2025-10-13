/* eslint-disable camelcase */
async ({ chat, message, id, args }) => {
  console.info('lib/bot/callbacks/payment/refund');
  console.debug({ chat, message, id, args });

  try {
    const { subPaymentId } = args;
    const ok = await domain.subscription.refundPayment({ subPaymentId });
    
    const answer = {
      callback_query_id: id,
      text: 'Платеж возвращен',
      show_alert: ok,
    };

    await lib.bot.wrappers.answerCallback(answer);
    return true; // false если не надо удалять исходное сообщение
  } catch (e) {
    console.error(e);
    return false;
  }
};