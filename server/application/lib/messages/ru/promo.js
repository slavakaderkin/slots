async ({ text, ref = '' }) => {

  const lines = [
    'Приложение для тех, кто принимает по записи и хочет держать эти записи в порядке и под рукой.\n',
    'Квик Пик просто настроить, в нем нет регистраций и сложных дашбордов. Он прост и удобен и для специалиста, и для клиента.\n',
    'Да что я рассказываю, открывайте и пробуйте там 14 дней бесплатно.'
  ];

  const caption = text || lines.join('\n');
  const photo = 'AgACAgIAAxkBAAIBuGjw2C41uV7E1UEvSiszYwkjOndeAAKC-zEb3C6IS8sgQYdjMvtbAQADAgADeAADNgQ';
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{  text: 'Открыть', url: `${config.bot.botUrl}/promo?startapp=ref_${ref}` }]  // ,
    ],
  });

  return { format: 'photo', photo, caption, parse_mode: 'HTML', reply_markup };
};