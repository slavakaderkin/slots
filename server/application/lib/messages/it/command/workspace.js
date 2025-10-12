async () => {
  const lines = [
    '<b>Area di lavoro</b>\n',
    'Qui i tuoi servizi, slot, prenotazioni e clienti.\n',
    'Se non hai ancora creato un profilo, qui puoi crearlo e configurarlo.\n'
  ];

  const inline_keyboard = [
    [{ text: 'Apri', web_app: { url: `${config.bot.web}/workspace` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}