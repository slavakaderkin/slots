async () => {
  const lines = [
    'Merhaba!\n',
    'Bu Quick Pick - randevu alma uygulamasıdır. Müşterileriniz sizden randevu alıyorsa ve randevularınızı düzenli tutmanız gerekiyorsa, bu uygulama sizin için.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Daha fazla bilgi', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}