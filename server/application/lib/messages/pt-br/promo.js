async ({ text, ref = '' }) => {
  const lines = [
    'Um app para quem atende com agendamento e quer manter esses agendamentos organizados e à mão.\n',
    'O Quick Pick é fácil de configurar, não tem cadastros e painéis complicados. É simples e conveniente tanto para o profissional quanto para o cliente.\n',
    'Mas pra que estou contando - abra e experimente lá por 14 dias grátis.'
  ];

  const caption = text || lines.join('\n');
  const photo = 'AgACAgIAAxkBAAIBuGjw2C41uV7E1UEvSiszYwkjOndeAAKC-zEb3C6IS8sgQYdjMvtbAQADAgADeAADNgQ';
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{  text: 'Abrir', url: `${config.bot.botUrl}/promo?startapp=ref_${ref}` }]
    ],
  });

  return { format: 'photo', photo, caption, parse_mode: 'HTML', reply_markup };
};