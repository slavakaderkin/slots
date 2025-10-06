async ({ booking, timezone }) => {
  const { serviceId, datetime, bookingId, profileId } = booking;
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    `<b>Randevu hakkında görüşlerinize ihtiyacımız var.</b>\n`,
    `<b>Profesyonel:</b> ${profile.name}`,
    `<b>Hizmet:</b> ${service.name}`,
    `<b>Saat:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'tr')}</u>\n`,
    'Ne düşünüyorsunuz?'
  ];

  const inline_keyboard = [
    [{ text: 'Randevu sayfası', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [
      { text: 'Yorum bırak', web_app: { url: `${config.bot.web}/feedback/${bookingId}` } },
      { text: 'Ben orada değildim', callback_data: `booking|cancel|bookingId=${bookingId}|dontNotify=true` }
    ]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};