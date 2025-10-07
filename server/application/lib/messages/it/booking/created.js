async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, comment } = booking;
  const { accountId } = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Nuova prenotazione</b>\n',
    `<b>Servizio:</b> ${service.name}`,
   `<b>Ora:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'it')}</u>`
  ];

  if (info?.username) lines.push(`<b>Account TG:</b> @${info.username}`);
  if (comment) lines.push(`<b>Commento: </b> <i>${comment}</i>`);

  const inline_keyboard = [
    [{ text: 'Pagina prenotazione', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [{ text: 'Cliente', url: `tg://user?id=${tg}` }]
  ];
  
  const actionButtons = [
    { text: 'Conferma ✅', callback_data: `booking|confirm|bookingId=${bookingId}` },
    { text: 'Cancella ❌', callback_data: `booking|cancel|id=${bookingId}` }
  ];

  if (!service.autoConfirm) {
    inline_keyboard.push(actionButtons);
    lines.push('\nNon dimenticare di confermare o cancellare la prenotazione. Altrimenti verrà automaticamente cancellata tra 30 minuti.');
  }

  
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};
