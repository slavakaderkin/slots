async () => {
  const lines = [
    '<b>Free trial has ended 😭</b>\n',
    'I hope you enjoyed the service and will continue using it with a subscription.\n',
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