async () => {
  const lines = [
    '<b>Готово 🎉 у вас 14 бесплатных дней</b>\n',
    'Теперь вам нужно настроить профиль, добавить услуги и слоты. После этого получите пост с кнопкой, отправьте его клиенту или закрепите в канале.\n',
    'Если что-то не понятно или есть идеи по улучшению, то напишите мне @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Настроить профиль', web_app: { url: `${config.bot.web}/settings` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};