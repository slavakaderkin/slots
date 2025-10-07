async ({ booking, timezone, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });
  const isOwner = profile.accountId === accountId;

  const lines = [
    '<b>Запись подтверждена</b> ✅\n',
    `<b>Услуга:</b> ${service.name}`,
    `<b>Время:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'ru')}</u>`,
  ];

  if (isOwner && info?.username) lines.push(`<b>TG аккаунт:</b> @${info.username}`);
  if (!isOwner) lines.push(`<b>Специалист:</b> ${profile.name}`);

  const inline_keyboard = [
    [{ text: 'Страница записи', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Клиент', url: `tg://user?id=${tg}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};