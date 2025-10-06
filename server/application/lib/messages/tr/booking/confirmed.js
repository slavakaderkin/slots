async ({ booking, timezone, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });
  const isOwner = profile.accountId === accountId;

  const lines = [
    '<b>Randevu onaylandı</b> ✅\n',
    `<b>Hizmet:</b> ${service.name}`,
    `<b>Saat:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'tr')}</u>`,
  ];

  if (isOwner && info?.username) lines.push(`<b>TG hesabı:</b> @${info.username}`);
  if (!isOwner) lines.push(`<b>Profesyonel:</b> ${profile.name}`);

  const inline_keyboard = [
    [{ text: 'Randevu sayfası', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Müşteri', url: `tg://user?id=${tg}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};