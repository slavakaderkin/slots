async () => {
  const lines = [
    '<b>Il periodo di prova gratuito è finito 😭</b>\n',
    'Spero che il servizio ti sia piaciuto e che continuerai a usarlo con un abbonamento.\n',
    'Se non eri soddisfatto di qualcosa o hai idee per miglioramenti, per favore scrivimi @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Scegli abbonamento', web_app: { url: `${config.bot.web}/promo` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};