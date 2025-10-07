async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, comment } = booking;
  const { accountId } = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Novo agendamento</b>\n',
    `<b>Serviço:</b> ${service.name}`,
   `<b>Horário:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'pt-br')}</u>`
  ];

  if (info?.username) lines.push(`<b>Conta TG:</b> @${info.username}`);
  if (comment) lines.push(`<b>Comentário: </b> <i>${comment}</i>`);

  const inline_keyboard = [
    [{ text: 'Página do agendamento', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [{ text: 'Cliente', url: `tg://user?id=${tg}` }]
  ];
  
  const actionButtons = [
    { text: 'Confirmar ✅', callback_data: `booking|confirm|bookingId=${bookingId}` },
    { text: 'Cancelar ❌', callback_data: `booking|cancel|id=${bookingId}` }
  ];

  if (!service.autoConfirm) {
    inline_keyboard.push(actionButtons);
    lines.push('\nNão esqueça de confirmar ou cancelar o agendamento. Caso contrário será cancelado automaticamente em 30 minutos.');
  }

  
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};