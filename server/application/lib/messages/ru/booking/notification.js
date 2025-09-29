async ({ booking, timezone, isDayly }) => {
  const { serviceId, datetime, clientId, bookingId, profileId } = booking;
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });

  const lines = [
    `${isDayly ? '<b>Напоминаем, что у вас сегодня есть запись.</b>' : '<b>Напоминаем, что у вас запись через час.</b>'}\n`,
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