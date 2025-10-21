async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment, bonuses } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Reminder: you have a booking today.</b>' : '<b>Reminder: you have a booking in one hour.</b>'}\n`,
    `<b>Service:</b> ${service.name}`,
    `<b>Time:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'en')}</u>`
  ];

  if (!isOwner) lines.push(`<b>Professional:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>TG account:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Comment: </b> <i>${comment}</i>`);
  if (isOwner && Number(bonuses)) {
    lines.push(`\n❗️ <b>To pay:</b> ${service.price - bonuses} ${profile.currency}\nClient pays ${bonuses} ${profile.currency} with bonuses.`);
  }
  if (needMeetLink) lines.push('\nDon\'t forget to specify the online meeting link. You can do this on the booking page.');

  const inline_keyboard = [
    [{ text: 'Booking page', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Contact client', url: `tg://user?id=${tg}` }]);
  if (!isOwner && isDayly) inline_keyboard.push([{ text: 'I can\'t make it :(', callback_data: `booking|cancel|id=${bookingId}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};