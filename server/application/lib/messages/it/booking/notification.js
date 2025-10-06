async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Ti ricordiamo che hai una prenotazione oggi.</b>' : '<b>Ti ricordiamo che hai una prenotazione tra un\'ora.</b>'}\n`,
    `<b>Servizio:</b> ${service.name}`,
    `<b>Ora:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'it')}</u>`
  ];

  if (!isOwner) lines.push(`<b>Professionista:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>Account TG:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Commento: </b> <i>${comment}</i>`);
  if (needMeetLink) lines.push('\nNon dimenticare di specificare il link per l\'incontro online. Puoi farlo nella pagina della prenotazione.');

  const inline_keyboard = [
    [{ text: 'Pagina prenotazione', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Cliente', url: `tg://user?id=${tg}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};