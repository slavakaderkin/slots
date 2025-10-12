async ({ account }) => {
  const { accountId, info } = account;
  const name = info.first_name.trim();

  const lines = [
    `<b>Merhaba, ${name}!</b>\n`,
    'İşte Quick Pick nedir:\n',
    '<b>✅ Tüm iş Telegram\'da.</b>',
    'Müşteriler, randevular ve slotlar tek bir yerde - burada.\n',
    '<b>✅ Basit kurulum</b>',
    'Kayıt, e-posta veya şifre yok. Formda sadece dört alan ve hepsi hazır.\n',
    '<b>✅ Üç tıklamada müşteri randevusu</b>',
    'Müşterilerin sadece hizmeti, slotu seçmesi ve butona tıklaması yeterli.\n',
    '<b>✅ Kanal veya sohbet için buton</b>',
    'Köşedeki bir kanala sabitleyebilirsiniz. Şimdi moda böyle.\n',
    '<b>✅ Randavu hatırlatıcıları</b>',
    'Randevulardan bir saat önce hatırlatırız. Müşteriye de sabah, unutmaması için.\n',
    '<b>✅ Hizmet değerlendirmeleri ve puanlama</b>',
    'Randevudan sonra müşteriye hizmet hakkında değerlendirme bırakmasını hatırlatırız.\n',
    '<b>✅ Canlı destek</b>',
    'Bir şey olursa, sadece bana yazın @arslaverza, ben hallederim.'

  ];

  const inline_keyboard = [
    [{ text: 'Ücretsiz Başla', callback_data: `trial|start|accountId=${accountId}` }], 
    [{ text: 'Abonelik Seç', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}