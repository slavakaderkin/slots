/* eslint-disable camelcase */
async ({ accountId, level, type }) => {
  const period = type === 'month' ? '30 дней' : 'год';
  const label = type === 'month' ? 'Цена за 30 дней' : 'Цена за год';
  const amount = type === 'month' ? 35000  : 250000;
  const prices = JSON.stringify([{ label, amount }]);
  const title = `Подписка на ${period}`;
  const description = `Оплата подписки на сервис бронирования слотов Квик Пик.`;
  const payload = `accountId=${accountId}+level=${level}+type=${type}`;

  const params = {
    title,
    description,
    payload,
    provider_token: config.bot.payment_token,
  
    currency: 'RUB',
    prices,
  };
  console.log("🚀 ~ config.bot.payment_token:", config.bot.payment_token)
  //if (type === 'month') params['subscription_period'] = 2592000;

  return params;
};
