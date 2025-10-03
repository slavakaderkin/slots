async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, comment } = booking;
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Напоминаем, что у вас сегодня есть запись.</b>' : '<b>Напоминаем, что у вас запись через час.</b>'}\n`,
    `<b>Услуга:</b> ${service.name}`,
    `<b>Время:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>`
  ];

  if (!isOwner) lines.push(`<b>Специалист:</b> ${profile.name}`);
  if (comment && isOwner) lines.push(`<b>Комментарий: </b> <i>${comment}</i>`);
  if (needMeetLink) lines.push('\nНе забудьте указать ссылку на онлайн встречу. Это можно сделать на странице записи.');

  const inline_keyboard = [
    [{ text: 'Страница записи', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};