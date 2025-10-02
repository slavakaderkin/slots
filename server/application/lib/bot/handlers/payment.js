async (params) => {
  console.info('lib/bot/handlers/payment');
  console.debug({ params });

  try {
    const { payment } = params;
    const { invoice_payload, total_amount: amount } = payment;

    const args = invoice_payload.split('+').reduce((obj, part) => {
      const [key, value] = part.split('=');
      obj[key] = value;
      return obj;
    }, {});

    const { level, type, accountId } = args;
    const days = type === 'month' ? 30 : 365;
    const paymentData = JSON.stringify(payment);

    let subscription = await db.pg.row('Subscription', { accountId });

    if (subscription) {
      const { end: start, subscriptionId } = subscription;
      const end = lib.utils.modTime(start, days, 'd');
      const updates = { end, isActive: true, level };
      await db.pg.update('Subscription', updates, { subscriptionId });

    } else {
      const start = new Date().toISOString();
      const end = lib.utils.modTime(start, days, 'd');
      const record = { level, accountId, start, end, isActive: true };
      [subscription] = await db.pg.insert('Subscription', record);
    }
   
    const { subscriptionId } = subscription;
    const paymentRecord = { subscriptionId, amount, state: 'completed', paymentData, type };
    const [subPayment] = await db.pg.insert('SubPayment', paymentRecord);

    const msg = await lib.messages.ru.admin.payment({ subscription, subPayment });
    await lib.bot.notify.admin({ msg });

  } catch (e) {
    console.error(e);
  }
};