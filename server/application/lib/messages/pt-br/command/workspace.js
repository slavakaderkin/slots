async () => {
  const lines = [
    '<b>Área de trabalho</b>\n',
    'Aqui seus serviços, horários, agendamentos e clientes.\n',
    'Se você ainda não criou um perfil, aqui pode criá-lo e configurá-lo.\n'
  ];

  const inline_keyboard = [
    [{ text: 'Abrir', web_app: { url: `${config.bot.web}/workspace` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}