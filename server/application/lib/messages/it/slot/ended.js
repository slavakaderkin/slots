async () => {
  const lines = [
    '<b>Hai esaurito gli slot disponibili</b>\n',
    'Per non perdere clienti, aggiungi slot per le prossime due settimane.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Area di lavoro', web_app: { url: `${config.bot.web}/workspace` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};