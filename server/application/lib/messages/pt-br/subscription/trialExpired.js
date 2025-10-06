async () => {
  const lines = [
    '<b>O período de teste gratuito acabou 😭</b>\n',
    'Espero que você tenha gostado do serviço e continuará usando com uma assinatura.\n',
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