async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, comment, profileId, bonuses } = booking;
  const { accountId } = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId });
  const service = await db.pg.row('Service', { serviceId });
  const profile = await db.pg.row('Profile', { profileId });

  const lines = [
    '<b>New booking</b>\n',
    `<b>Service:</b> ${service.name}`,
   `<b>Time:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'en')}</u>`
  ];

  if (info?.username) lines.push(`<b>TG account:</b> @${info.username}`);
  if (comment) lines.push(`<b>Comment: </b> <i>${comment}</i>`);
  if (Number(bonuses)) {
    lines.push(`\n❗️ <b>To pay:</b> ${service.price - bonuses} ${profile.currency}\nClient pays ${bonuses} ${profile.currency} with bonuses.`);
  }

  const inline_keyboard = [
    [{ text: 'Booking page', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [{ text: 'Client', url: `tg://user?id=${tg}` }]
  ];
  
  const actionButtons = [
    { text: 'Confirm ✅', callback_data: `booking|confirm|bookingId=${bookingId}` },
    { text: 'Cancel ❌', callback_data: `booking|cancel|id=${bookingId}` }
  ];

  if (!service.autoConfirm) {
    inline_keyboard.push(actionButtons);
    lines.push('\nDon\'t forget to confirm or cancel the booking. Otherwise it will be automatically cancelled in 30 minutes.');
  }

  
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};