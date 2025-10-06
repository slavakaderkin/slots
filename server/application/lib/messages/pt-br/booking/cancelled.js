async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, profileId } = booking;
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Agendamento cancelado</b> ❌\n',
    `<b>Serviço:</b> ${service.name}`,
    `<b>Horário:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>`
  ];

  const inline_keyboard = [
    [{ text: 'Página do agendamento', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};