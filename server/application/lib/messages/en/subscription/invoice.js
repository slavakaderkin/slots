async ({ accountId, level, type }) => {
  const period = type === 'month' ? '30 days' : 'year';
  const label = type === 'month' ? 'Price for 30 days' : 'Price for year';
  const amount = type === 'month' ? 350  : 2500;
  const prices = JSON.stringify([{ label, amount }]);
  const title = `Subscription for ${period}`;
  const description = `Payment for Quick Pick booking service subscription.`;
  const payload = `accountId=${accountId}+level=${level}+type=${type}`;

  const params = {
    title,
    description,
    payload,
    provider_token: '', //config.bot.payment_token,
    currency: 'XTR',
    prices,
  };

  if (type === 'month') params['subscription_period'] = 2592000;

  return params;
};