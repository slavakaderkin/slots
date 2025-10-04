async () => {
  const lines = [
    '<b>Ваша подписка всё 😭</b>\n',
    'Теперь вы не сможете добавлять новые слоты и записывать клиентов, но все вернется после оплаты.\n',
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