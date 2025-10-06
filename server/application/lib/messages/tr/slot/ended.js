async () => {
  const lines = [
    '<b>Uygun zaman aralıklarınız tükendi</b>\n',
    'Müşteri kaybetmemek için önümüzdeki iki hafta için zaman aralığı ekleyin.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Çalışma Alanı', web_app: { url: `${config.bot.web}/workspace` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};