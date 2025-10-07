async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, comment } = booking;
  const { accountId } = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Новая запись</b>\n',
    `<b>Услуга:</b> ${service.name}`,
   `<b>Время:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'ru')}</u>`
  ];

  if (info?.username) lines.push(`<b>TG аккаунт:</b> @${info.username}`);
  if (comment) lines.push(`<b>Комментарий: </b> <i>${comment}</i>`);

  const inline_keyboard = [
    [{ text: 'Страница записи', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [{ text: 'Клиент', url: `tg://user?id=${tg}` }]
  ];
  
  const actionButtons = [
    { text: 'Подтвердить ✅', callback_data: `booking|confirm|bookingId=${bookingId}` },
    { text: 'Отменить ❌', callback_data: `booking|cancel|id=${bookingId}` }
  ];

  if (!service.autoConfirm) {
    inline_keyboard.push(actionButtons);
    lines.push('\nНе забудте подтвердить или отменить запись. Иначе она отменится автоматически через 30 минут.');
  }

  
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};