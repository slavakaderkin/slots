async () => {
  const lines = [
    '<b>Client personal account</b>\n',
    'Here your specialists and appointments with them will appear. For now, you can only see specialists you have booked directly with. Soon we will add a full catalog with filter by cities and services.\n',
    'If you provide services and want to take online bookings, press /workspace\n'
  ];

  const inline_keyboard = [
    [{ text: 'Open', web_app: { url: `${config.bot.web}` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}