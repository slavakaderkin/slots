async ({ booking, timezone, isDayly, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, comment } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    `${isDayly ? '<b>Lembramos que você tem um agendamento hoje.</b>' : '<b>Lembramos que você tem um agendamento em uma hora.</b>'}\n`,
    `<b>Serviço:</b> ${service.name}`,
    `<b>Horário:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>`
  ];

  if (!isOwner) lines.push(`<b>Profissional:</b> ${profile.name}`);
  if (isOwner && info?.username) lines.push(`<b>Conta TG:</b> @${info.username}`);
  if (comment && isOwner) lines.push(`<b>Comentário: </b> <i>${comment}</i>`);
  if (needMeetLink) lines.push('\nNão esqueça de especificar o link da reunião online. Você pode fazer isso na página do agendamento.');

  const inline_keyboard = [
    [{ text: 'Página do agendamento', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];

  if (isOwner) inline_keyboard.push( [{ text: 'Cliente', url: `tg://user?id=${tg}` }])
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};