async ({ account }) => {
  const { accountId, info } = account;
  const name = info.first_name.trim();

  const lines = [
    `<b>Hello, ${name}!</b>\n`,
    'Here\'s what Quick Pick is:\n',
    '<b>✅ All work in Telegram.</b>',
    'Clients, bookings and slots in one place - here.\n',
    '<b>✅ Simple setup</b>',
    'No registrations, emails or passwords. Just four fields in the form and that\'s it.\n',
    '<b>✅ Client booking in three clicks</b>',
    'Clients just need to choose the service, slot and press the button.\n',
    '<b>✅ Button for channel or chat</b>',
    'Can be pinned in the channel in the corner. It\'s fashionable now.\n',
    '<b>✅ Booking reminders</b>',
    'We remind about bookings an hour before. And to the client also in the morning, so they don\'t forget.\n',
    '<b>✅ Service reviews and rating</b>',
    'We remind the client to leave a review about the service after booking.\n',
    '<b>✅ Live support</b>',
    'If something happens, just write to me @arslaverza, I\'ll solve everything.'

  ];

  const inline_keyboard = [
    [{ text: 'Start for free', callback_data: `trial|start|accountId=${accountId}` }], 
    [{ text: 'Choose subscription', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}