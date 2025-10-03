async () => {
  const lines = [
    '<b>Бесплатный период всё 😭</b>\n',
    'Надеюсь вам понравился сервис и вы продолжите им пользоваться, но уже по подписке.\n',
    'Если вы были чем-то не довольны или есть идеи по улучшению, то напишите мне @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Выбрать подписку', web_app: { url: `${config.bot.web}/promo` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};