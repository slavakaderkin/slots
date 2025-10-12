async () => {
  const lines = [
    '<b>Müşteri Kişisel Hesabı</b>\n',
    'Burada uzmanlarınız ve onlarla randevularınız görünecek. Şu anda yalnızca doğrudan randevu aldığınız uzmanları görebilirsiniz. Yakında şehir ve hizmet filtreli tam katalog ekleyeceğiz.\n',
    'Hizmet veriyorsanız ve çevrimiçi randevu almak istiyorsanız /workspace tuşlayın\n'
  ];

  const inline_keyboard = [
    [{ text: 'Aç', web_app: { url: `${config.bot.web}` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}