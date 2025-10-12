async () => {
  const lines = [
    '<b>Workspace</b>\n',
    'Here are your services, slots, bookings and clients.\n',
    'If you haven\'t created a profile yet, you can create and configure it here.\n'
  ];

  const inline_keyboard = [
    [{ text: 'Open', web_app: { url: `${config.bot.web}/workspace` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}