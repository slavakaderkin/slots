async () => {
  const lines = [
    '<b>У вас закончились свободные слоты</b>\n',
    'Чтобы не терять клиентов, добавьте слоты на следующие две недели.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Рабочий кабинет', web_app: { url: `${config.bot.web}/workspace` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};