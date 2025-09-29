async ({ booking, timezone }) => {
  const { serviceId, datetime, bookingId, profileId } = booking;
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Запись подтверждена</b>\n',
    `<b>Специалист:</b> ${profile.name}`,
    `<b>Услуга:</b> ${service.name}`,
    `<b>Время:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>`
  ];

  const inline_keyboard = [
    [{ text: 'Страница записи', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};