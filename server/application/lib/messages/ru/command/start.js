async () => {
  const lines = [
    'Привет!\n',
    'Это Квик Пик — приложение для записи на услуги. Если к вам записываются клиенты и вам нужно контролировать время, то оно для вас.\n',
    'Создайте профиль за 5 минут и люди смогут записаться к вам в три клика прямо в Telegram.',
  ];

  const inline_keyboard = [
    [{ text: 'Подробнее', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}