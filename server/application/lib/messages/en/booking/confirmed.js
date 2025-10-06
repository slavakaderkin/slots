async ({ booking, timezone, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });
  const isOwner = profile.accountId === accountId;

  const lines = [
    '<b>Booking confirmed</b> ✅\n',
    `<b>Service:</b> ${service.name}`,
    `<b>Time:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>`,
  ];

  if (isOwner && info?.username) lines.push(`<b>TG account:</b> @${info.username}`);
  if (!isOwner) lines.push(`<b>Professional:</b> ${profile.name}`);

  const inline_keyboard = [
    [{ text: 'Booking page', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Client', url: `tg://user?id=${tg}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};