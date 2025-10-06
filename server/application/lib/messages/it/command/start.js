async () => {
  const lines = [
    'Ciao!\n',
    'Questo è Quick Pick - un\'app per prenotare appuntamenti. Se hai clienti che prenotano con te e hai bisogno di tenere gli appuntamenti organizzati, è perfetta per te.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Scopri di più', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}