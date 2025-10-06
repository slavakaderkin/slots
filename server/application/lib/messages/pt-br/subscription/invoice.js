async ({ accountId, level, type }) => {
  const period = type === 'month' ? '30 dias' : 'ano';
  const label = type === 'month' ? 'Preço por 30 dias' : 'Preço anual';
  const amount = type === 'month' ? 350  : 2500;
  const prices = JSON.stringify([{ label, amount }]);
  const title = `Assinatura por ${period}`;
  const description = `Pagamento da assinatura do serviço de agendamento Quick Pick.`;
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