async () => {
  const lines = [
    '<b>Sua assinatura acabou 😭</b>\n',
    'Agora você não poderá adicionar novos horários e agendar clientes, mas tudo voltará após o pagamento.\n',
    'Se você não estava satisfeito com algo ou tem ideias de melhorias, por favor me escreva @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Escolher assinatura', web_app: { url: `${config.bot.web}/promo` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};