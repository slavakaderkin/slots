async () => {
  const lines = [
    '<b>Fatto 🎉 hai 14 giorni gratuiti</b>\n',
    'Ora devi configurare il profilo, aggiungere servizi e slot. Dopodiché riceverai un post con un pulsante, invialo al cliente o fissalo in un canale.\n',
    'Se qualcosa non è chiaro o hai idee per miglioramenti, scrivimi @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Configura profilo', web_app: { url: `${config.bot.web}/settings` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};