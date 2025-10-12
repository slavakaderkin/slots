async () => {
  const lines = [
    '<b>Account personale del cliente</b>\n',
    'Qui appariranno i tuoi specialisti e le prenotazioni con loro. Per ora puoi vedere solo gli specialisti con cui hai prenotato direttamente. Presto aggiungeremo un catalogo completo con filtro per città e servizi.\n',
    'Se fornisci servizi e vuoi gestire prenotazioni online, premi /workspace\n'
  ];

  const inline_keyboard = [
    [{ text: 'Apri', web_app: { url: `${config.bot.web}` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}