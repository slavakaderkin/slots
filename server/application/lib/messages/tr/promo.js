async ({ text, ref = '' }) => {
  const lines = [
    'Randevu alan ve bu randevuları düzenli ve el altında tutmak isteyenler için bir uygulama.\n',
    'Quick Pick\'i kurmak kolay, kayıt ve karmaşık panolar yok. Hem profesyonel hem de müşteri için basit ve kullanışlı.\n',
    'Neden anlatıyorum ki - açın ve orada 14 gün ücretsiz deneyin.'
  ];

  const caption = text || lines.join('\n');
  const photo = 'AgACAgIAAxkBAAIBuGjw2C41uV7E1UEvSiszYwkjOndeAAKC-zEb3C6IS8sgQYdjMvtbAQADAgADeAADNgQ';
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{  text: 'Aç', url: `${config.bot.botUrl}/promo?startapp=ref_${ref}` }]
    ],
  });

  return { format: 'photo', photo, caption, parse_mode: 'HTML', reply_markup };
};