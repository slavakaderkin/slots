async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment, bonuses } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Promemoria: hai una prenotazione oggi.</b>' : '<b>Promemoria: hai una prenotazione tra un\'ora.</b>'}\n`,
    `<b>Servizio:</b> ${service.name}`,
    `<b>Ora:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'it')}</u>`
  ];

  if (!isOwner) lines.push(`<b>Professionista:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>Account TG:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Commento: </b> <i>${comment}</i>`);
  if (isOwner && Number(bonuses)) {
    lines.push(`\n❗️ <b>Da pagare:</b> ${service.price - bonuses} ${profile.currency}\nIl cliente paga ${bonuses} ${profile.currency} con bonus.`);
  }
  if (needMeetLink) lines.push('\nNon dimenticare di specificare il link per l\'incontro online. Puoi farlo nella pagina della prenotazione.');

  const inline_keyboard = [
    [{ text: 'Pagina prenotazione', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Contatta cliente', url: `tg://user?id=${tg}` }]);
  if (!isOwner && isDayly) inline_keyboard.push([{ text: 'Non posso venire :(', callback_data: `booking|cancel|id=${bookingId}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};