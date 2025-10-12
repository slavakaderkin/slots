async () => {
  const lines = [
    '<b>Pronto 🎉 você tem 14 dias gratuitos</b>\n',
    'Agora você precisa configurar o perfil, adicionar serviços e horários. Depois disso, receba uma postagem com botão, envie para o cliente ou fixe no canal.\n',
    'Se algo não estiver claro ou tiver ideias de melhorias, me escreva @arslaverza.'
  ];

  const inline_keyboard = [
    [{ text: 'Configurar perfil', web_app: { url: `${config.bot.web}/settings` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};