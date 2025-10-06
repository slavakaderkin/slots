async ({ subscription, subPayment }) => {
  const { accountId, subscriptionId } = subscription;
  const { subPaymentId, amount, paymentData } = subPayment;
  const { telegram_payment_charge_id } = paymentData;
  const { info, tg } = await db.pg.row('Account', { accountId });

  const lines = [
    `<b>Платеж на сумму ${amount} ⭐️</b>\n`,
    `<b>ID платежа: </b>${subPaymentId}`,
    `<b>ID подписки: </b>${subscriptionId}`,
    `<b>ID клиента: </b>${accountId}`,
  ];

  if (info?.username) lines.push(`<b>Аккаунт: </b> @${info.username}`);

  const inline_keyboard = [
    [{ text: 'Клиент', url: `tg://user?id=${tg}` }],
    [{ text: 'Вернуть', callback_data: `payment|refund|subPaymentId=${subPaymentId}` }] 
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  return { text, parse_mode: 'HTML', reply_markup };
};