async ({ accountId, level, type }) => {
  const period = type === 'month' ? '30 gün' : 'yıl';
  const label = type === 'month' ? '30 günlük fiyat' : 'Yıllık fiyat';
  const amount = type === 'month' ? 350  : 2500;
  const prices = JSON.stringify([{ label, amount }]);
  const title = `${period} abonelik`;
  const description = `Quick Pick rezervasyon hizmeti abonelik ödemesi.`;
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