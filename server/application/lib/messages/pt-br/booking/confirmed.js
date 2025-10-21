async ({ booking, timezone, accountId }) => {
  const { serviceId, datetime, bookingId, profileId, clientId, bonuses } = booking;
  const client = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId: client.accountId });
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });
  const isOwner = profile.accountId === accountId;
  const needMeetLink = isOwner && (booking.isOnlne || service.isOnline) && !booking.meetLink;

  const lines = [
    '<b>Agendamento confirmado</b> ✅\n',
    `<b>Serviço:</b> ${service.name}`,
    `<b>Horário:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'pt-br')}</u>`,
  ];

  if (isOwner && info?.username) lines.push(`<b>Conta TG:</b> @${info.username}`);
  if (!isOwner) lines.push(`<b>Profissional:</b> ${profile.name}`);
  if (isOwner && Number(bonuses)) {
    lines.push(`\n❗️ <b>A pagar:</b> ${service.price - bonuses} ${profile.currency}\nCliente paga ${bonuses} ${profile.currency} com bônus.`);
  }
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
