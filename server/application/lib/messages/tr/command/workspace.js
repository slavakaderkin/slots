async () => {
  const lines = [
    '<b>Çalışma Alanı</b>\n',
    'Burada hizmetleriniz, slotlarınız, randevularınız ve müşterileriniz bulunur.\n',
    'Henüz bir profil oluşturmadıysanız, burada oluşturup yapılandırabilirsiniz.\n'
  ];

  const inline_keyboard = [
    [{ text: 'Aç', web_app: { url: `${config.bot.web}/workspace` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}