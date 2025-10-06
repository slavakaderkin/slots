async () => {
  const lines = [
    '<b>Ücretsiz deneme süreniz sona erdi 😭</b>\n',
    'Umarım hizmetten memnun kalmışsınızdır ve abonelikle kullanmaya devam edersiniz.\n',
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