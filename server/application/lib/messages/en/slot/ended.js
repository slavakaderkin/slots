async () => {
  const lines = [
    '<b>You\'ve run out of available slots</b>\n',
    'To avoid losing clients, add slots for the next two weeks.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Workspace', web_app: { url: `${config.bot.web}/workspace` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};