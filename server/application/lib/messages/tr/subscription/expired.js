async () => {
  const lines = [
    '<b>Aboneliğiniz sona erdi 😭</b>\n',
    'Artık yeni zaman aralığı ekleyemez ve müşteri kaydedemezsiniz, ancak ödeme sonrası her şey geri dönecektir.\n',
    'Memnun kalmadığınız bir şey varsa veya iyileştirme fikirleriniz varsa, lütfen bana yazın @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Abonelik seç', web_app: { url: `${config.bot.web}/promo` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};