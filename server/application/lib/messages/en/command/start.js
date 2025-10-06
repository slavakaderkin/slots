async () => {
  const lines = [
    'Hello!\n',
    'This is Quick Pick - an appointment booking app. If you have clients booking with you and need to keep appointments organized, it\'s for you.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Learn more', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}