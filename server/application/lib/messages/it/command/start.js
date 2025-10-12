async ({ account }) => {
  const { accountId, info } = account;
  const name = info.first_name.trim();

  const lines = [
    `<b>Ciao, ${name}!</b>\n`,
    'Ecco cos\'è Quick Pick:\n',
    '<b>✅ Tutto il lavoro in Telegram.</b>',
    'Clienti, prenotazioni e slot in un unico posto - qui.\n',
    '<b>✅ Configurazione semplice</b>',
    'Nessuna registrazione, email o password. Solo quattro campi nel modulo e tutto è pronto.\n',
    '<b>✅ Prenotazione clienti in tre clic</b>',
    'I clienti devono solo scegliere il servizio, lo slot e premere il pulsante.\n',
    '<b>✅ Pulsante per canale o chat</b>',
    'Puoi aggiungerlo in un canale nell\'angolo. È di moda adesso.\n',
    '<b>✅ Promemoria per le prenotazioni</b>',
    'Ti ricordiamo le prenotazioni un\'ora prima. E al cliente anche la mattina, per non dimenticare.\n',
    '<b>✅ Recensioni sui servizi e valutazioni</b>',
    'Ricordiamo al cliente di lasciare una recensione sul servizio dopo la prenotazione.\n',
    '<b>✅ Supporto in tempo reale</b>',
    'Se succede qualcosa, scrivimi semplicemente @arslaverza, risolverò tutto.'

  ];

  const inline_keyboard = [
    [{ text: 'Inizia gratuitamente', callback_data: `trial|start|accountId=${accountId}` }], 
    [{ text: 'Scegli abbonamento', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}