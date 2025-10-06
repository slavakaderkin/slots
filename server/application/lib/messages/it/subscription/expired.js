async () => {
  const lines = [
    '<b>Il tuo abbonamento è finito 😭</b>\n',
    'Ora non potrai aggiungere nuovi slot e prenotare clienti, ma tutto tornerà dopo il pagamento.\n',
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