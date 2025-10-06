async () => {
  const lines = [
    '<b>Você ficou sem horários disponíveis</b>\n',
    'Para não perder clientes, adicione horários para as próximas duas semanas.\n',
  ];

  const inline_keyboard = [
    [{ text: 'Área de Trabalho', web_app: { url: `${config.bot.web}/workspace` } }]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};