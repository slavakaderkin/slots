async () => {
  const lines = [
    '<b>Tamamlandı 🎉 14 günlük ücretsiz erişiminiz var</b>\n',
    'Şimdi profili yapılandırmanız, hizmetler ve slotlar eklemeniz gerekiyor. Ardından butonlu bir gönderi alın, müşteriye gönderin veya kanalda sabitleyin.\n',
    'Bir şey net değilse veya iyileştirme fikirleriniz varsa, bana yazın @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Profili Yapılandır', web_app: { url: `${config.bot.web}/settings` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};