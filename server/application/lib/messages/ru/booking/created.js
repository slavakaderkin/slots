async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, state, bookingId, profileId } = booking;
  const { autoConfirm } = await db.pg.row('Service', { serviceId });
  const service = await db.pg.row('Service', { serviceId });
  const client = await domain.client.byId({ clientId, full: true });

  const lines = [
    '<b>Новая запись</b>\n',
    `<b>Услуга:</b> ${service.name}`,
   `<b>Время:</b> <u>${lib.utils.toHumanDate(datetime, timezone)}</u>`
  ];

  const username = client?.info?.username;
  if (username) lines.push(`<b>Клиент:</b> @${username}`);

  const inline_keyboard = [
    [{ text: 'Страница записи', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }]
  ];
  
  const actionButtons = [
    { text: 'Подтвердить ✅', callback_data: `booking|confirm|bookingId=${bookingId}` },
    { text: 'Отменить ❌', callback_data: `booking|cancel|bookingId=${bookingId}` }
  ];

  if (!autoConfirm) {
    inline_keyboard.push(actionButtons);
    lines.push('\nНе забудте подтвердить или отменить запись. Иначе она отменится автоматически через 30 минут.');
  }

  
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};