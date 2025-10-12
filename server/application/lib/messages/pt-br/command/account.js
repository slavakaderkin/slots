async () => {
  const lines = [
    '<b>Conta pessoal do cliente</b>\n',
    'Aqui aparecerão seus especialistas e agendamentos com eles. Por enquanto, só é possível ver especialistas com quem você agendou diretamente. Em breve adicionaremos um catálogo completo com filtro por cidades e serviços.\n',
    'Se você presta serviços e quer fazer agendamentos online, pressione /workspace\n'
  ];

  const inline_keyboard = [
    [{ text: 'Abrir', web_app: { url: `${config.bot.web}` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}