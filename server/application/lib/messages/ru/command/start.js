async ({ account }) => {
  const { accountId, info } = account;
  const name = info.first_name.trim();

  const lines = [
    `<b>Привет, ${name}!</b>\n`,
    'Вот что такое Квик Пик:\n',
    '<b>✅ Вся работа в Telegram.</b>',
    'Клиенты, записи и слоты в одном месте — здесь.\n',
    '<b>✅ Простая настройка</b>',
    'Никаких регистраций, почт и паролей. Всего четыре поля в форме и всё.\n',
    '<b>✅ Запись клиентов в три клика <a href="https://t.me/PickQuickBot/profile?startapp=p_3_">(так выглядит профиль)</a></b>',
    'Клиентам нужно лишь выбрать услугу, слот и нажать кнопку.\n',
    '<b>✅ Кнопка для канала или чата</b>',
    'Можно повесить в канале в углу. Сейчас так модно.\n',
    '<b>✅ Напоминания о записях</b>',
    'Напомним о записях за час. Клиенту еще и утром, чтобы не забыл.\n',
    '<b>✅ Отзывы на услуги и рейтинг</b>',
    'Напомним клиенту оставить отзыв на услугу после записи.\n',
    '<b>✅ Живая поддержка</b>',
    'Если что-то случится, просто напишите мне @arslaverza, я всё решу.'

  ];

  const inline_keyboard = [
    [{ text: 'Начать бесплатно', callback_data: `trial|start|accountId=${accountId}` }], 
    [{ text: 'Выбрать подписку', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}