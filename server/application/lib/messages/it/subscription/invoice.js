async ({ accountId, level, type }) => {
  const period = type === 'month' ? '30 giorni' : 'anno';
  const label = type === 'month' ? 'Prezzo per 30 giorni' : 'Prezzo annuale';
  const amount = type === 'month' ? 350  : 2500;
  const prices = JSON.stringify([{ label, amount }]);
  const title = `Abbonamento per ${period}`;
  const description = `Pagamento per l\'abbonamento al servizio di prenotazione Quick Pick.`;
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