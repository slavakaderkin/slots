async ({ booking, timezone }) => {
  const { serviceId, datetime, bookingId, profileId } = booking;
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    `<b>Precisamos da sua opinião sobre o agendamento.</b>\n`,
    `<b>Profissional:</b> ${profile.name}`,
    `<b>Serviço:</b> ${service.name}`,
    `<b>Horário:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>\n`,
    'O que você achou?'
  ];

  const inline_keyboard = [
    [{ text: 'Página do agendamento', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [
      { text: 'Deixar avaliação', web_app: { url: `${config.bot.web}/feedback/${bookingId}` } },
      { text: 'Não estive presente', callback_data: `booking|cancel|bookingId=${bookingId}|dontNotify=true` }
    ]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};