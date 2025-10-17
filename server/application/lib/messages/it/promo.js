async ({ text, ref = '' }) => {
  const lines = [
    'Un\'app per chi accetta appuntamenti e vuole mantenerli organizzati e a portata di mano.\n',
    'Quick Pick è facile da configurare, non ci sono registrazioni e dashboard complicate. È semplice e conveniente sia per il professionista che per il cliente.\n',
    'Ma perché ve lo sto raccontando - aprite e provatelo lì per 14 giorni gratuiti.'
  ];

  const caption = text || lines.join('\n');
  const photo = 'AgACAgIAAxkBAAIBuGjw2C41uV7E1UEvSiszYwkjOndeAAKC-zEb3C6IS8sgQYdjMvtbAQADAgADeAADNgQ';
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{  text: 'Apri', url: `${config.bot.botUrl}/promo?startapp=ref_${ref}` }]
    ],
  });

  return { format: 'photo', photo, caption, parse_mode: 'HTML', reply_markup };
};