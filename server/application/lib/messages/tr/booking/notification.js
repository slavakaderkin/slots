async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment, bonuses } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Hatırlatma: bugün bir randevunuz var.</b>' : '<b>Hatırlatma: bir saat içinde randevunuz var.</b>'}\n`,
    `<b>Hizmet:</b> ${service.name}`,
    `<b>Saat:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'tr')}</u>`
  ];

  if (!isOwner) lines.push(`<b>Profesyonel:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>TG hesabı:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Yorum: </b> <i>${comment}</i>`);
  if (isOwner && Number(bonuses)) {
    lines.push(`\n❗️ <b>Ödenecek:</b> ${service.price - bonuses} ${profile.currency}\nMüşteri ${bonuses} ${profile.currency} bonus ile ödüyor.`);
  }
  if (needMeetLink) lines.push('\nÇevrimiçi toplantı bağlantısını belirtmeyi unutmayın. Bunu randevu sayfasında yapabilirsiniz.');

  const inline_keyboard = [
    [{ text: 'Randevu sayfası', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Müşteriyle iletişime geç', url: `tg://user?id=${tg}` }]);
  if (!isOwner && isDayly) inline_keyboard.push([{ text: 'Gelemeyeceğim :(', callback_data: `booking|cancel|id=${bookingId}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};