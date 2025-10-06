async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, profileId } = booking;
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Prenotazione cancellata</b> ❌\n',
    `<b>Servizio:</b> ${service.name}`,
    `<b>Ora:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'it')}</u>`
  ];

  const inline_keyboard = [
    [{ text: 'Pagina prenotazione', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};