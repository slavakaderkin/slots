async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Напоминаем, что у вас сегодня есть запись.</b>' : '<b>Напоминаем, что у вас запись через час.</b>'}\n`,
    `<b>Услуга:</b> ${service.name}`,
    `<b>Время:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'ru')}</u>`
  ];

  if (!isOwner) lines.push(`<b>Специалист:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>TG аккаунт:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Комментарий: </b> <i>${comment}</i>`);
  if (needMeetLink) lines.push('\nНе забудьте указать ссылку на онлайн встречу. Это можно сделать на странице записи.');

  const inline_keyboard = [
    [{ text: 'Страница записи', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Связаться с клиентом', url: `tg://user?id=${tg}` }]);
  if (!isOwner && isDayly) inline_keyboard.push([{ text: 'Не смогу :(', callback_data: `booking|cancel|id=${bookingId}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};