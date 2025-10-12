async () => {
  const lines = [
    '<b>Done 🎉 you have 14 free days</b>\n',
    'Now you need to set up your profile, add services and slots. After that, get a post with a button, send it to the client or pin it in the channel.\n',
    'If something is not clear or you have improvement ideas, write to me @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Set up profile', web_app: { url: `${config.bot.web}/settings` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};