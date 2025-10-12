async () => {
  const lines = [
    '<b>Личный кабинет клиента</b>\n',
    'Здесь появятся ваши специалисты и записи к ним. Пока можно видеть только специалистов, к которым вы записывались напрямую. Скоро добавим полный каталог с фильтром по городам и услугам.\n',
    'Если вы оказываете услуги и хотите вести онлайн-запись, то нажмите /workspace\n'
  ];

  const inline_keyboard = [
    [{ text: 'Открыть', web_app: { url: `${config.bot.web}` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}