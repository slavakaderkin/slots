async ({ booking, timezone }) => {
  const { serviceId, datetime, bookingId, profileId } = booking;
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    `<b>We need your feedback about the booking.</b>\n`,
    `<b>Professional:</b> ${profile.name}`,
    `<b>Service:</b> ${service.name}`,
    `<b>Time:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'en')}</u>\n`,
    'What do you think?'
  ];

  const inline_keyboard = [
    [{ text: 'Booking page', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [
      { text: 'Leave review', web_app: { url: `${config.bot.web}/feedback/${bookingId}` } },
      { text: 'I wasn\'t there', callback_data: `booking|cancel|id=${bookingId}|not=1` }
    ]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};