async ({ booking, timezone }) => {
  const { serviceId, datetime, clientId, bookingId, comment } = booking;
  const { accountId } = await db.pg.row('Client', { clientId })
  const { tg, info } = await db.pg.row('Account', { accountId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    '<b>Yeni randevu</b>\n',
    `<b>Hizmet:</b> ${service.name}`,
   `<b>Saat:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'tr')}</u>`
  ];

  if (info?.username) lines.push(`<b>TG hesabı:</b> @${info.username}`);
  if (comment) lines.push(`<b>Yorum: </b> <i>${comment}</i>`);

  const inline_keyboard = [
    [{ text: 'Randevu sayfası', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [{ text: 'Müşteri', url: `tg://user?id=${tg}` }]
  ];
  
  const actionButtons = [
    { text: 'Onayla ✅', callback_data: `booking|confirm|bookingId=${bookingId}` },
    { text: 'İptal Et ❌', callback_data: `booking|cancel|id=${bookingId}` }
  ];

  if (!service.autoConfirm) {
    inline_keyboard.push(actionButtons);
    lines.push('\nRandevuyu onaylamayı veya iptal etmeyi unutmayın. Aksi takdirde 30 dakika sonra otomatik olarak iptal edilecektir.');
  }

  
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};