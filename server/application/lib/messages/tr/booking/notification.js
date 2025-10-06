async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Bugün bir randevunuz olduğunu hatırlatıyoruz.</b>' : '<b>Bir saat içinde randevunuz olduğunu hatırlatıyoruz.</b>'}\n`,
    `<b>Hizmet:</b> ${service.name}`,
    `<b>Saat:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'tr')}</u>`
  ];

  if (!isOwner) lines.push(`<b>Profesyonel:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>TG hesabı:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Yorum: </b> <i>${comment}</i>`);
  if (needMeetLink) lines.push('\nÇevrimiçi toplantı bağlantısını belirtmeyi unutmayın. Bunu randevu sayfasında yapabilirsiniz.');

  const inline_keyboard = [
    [{ text: 'Randevu sayfası', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Müşteri', url: `tg://user?id=${tg}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};