async () => {
  const lines = [
    '<b>Рабочий кабинет</b>\n',
    'Здесь ваши услуги, слоты, записи и клиенты.\n',
    'Если вы еще не создали профиль, то здесь его можно создать и настроить.\n'
  ];

  const inline_keyboard = [
    [{ text: 'Открыть', web_app: { url: `${config.bot.web}/workspace` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}