async () => {
  const lines = [
    '<b>Your subscription has ended 😭</b>\n',
    'You won\'t be able to add new slots and book clients now, but everything will be restored after payment.\n',
    'If you were unsatisfied with something or have improvement ideas, please write to me @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Choose subscription', web_app: { url: `${config.bot.web}/promo` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};