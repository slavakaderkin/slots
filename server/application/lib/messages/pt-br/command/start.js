async () => {
  const lines = [
    'Olá!\n',
    'Este é o Quick Pick - um app para agendamento de serviços. Se você tem clientes que agendam com você e precisa manter os agendamentos organizados, é perfeito para você.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Saiba mais', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}