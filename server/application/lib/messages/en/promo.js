async ({ text, ref = '' }) => {
  const lines = [
    'An app for those who accept appointments and want to keep these appointments organized and at hand.\n',
    'Quick Pick is easy to set up, there are no registrations and complicated dashboards. It\'s simple and convenient for both the professional and the client.\n',
    'But why am I telling you this - open it and try it there for 14 days free.'
  ];

  const caption = text || lines.join('\n');
  const photo = 'AgACAgIAAxkBAAIBuGjw2C41uV7E1UEvSiszYwkjOndeAAKC-zEb3C6IS8sgQYdjMvtbAQADAgADeAADNgQ';
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{  text: 'Open', url: `${config.bot.botUrl}/promo?startapp=ref_${ref}` }]
    ],
  });

  return { format: 'photo', photo, caption, parse_mode: 'HTML', reply_markup };
};