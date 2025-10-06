async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, profileId } = booking;
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Booking cancelled</b> ❌\n',
    `<b>Service:</b> ${service.name}`,
    `<b>Time:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'en')}</u>`
  ];

  const inline_keyboard = [
    [{ text: 'Booking page', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};