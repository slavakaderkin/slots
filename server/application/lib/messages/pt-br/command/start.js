async ({ account }) => {
  const { accountId, info } = account;
  const name = info.first_name.trim();

  const lines = [
    `<b>Olá, ${name}!</b>\n`,
    'Aqui está o que é o Quick Pick:\n',
    '<b>✅ Todo o trabalho no Telegram.</b>',
    'Clientes, agendamentos e horários em um só lugar - aqui.\n',
    '<b>✅ Configuração simples</b>',
    'Sem registros, e-mails ou senhas. Apenas quatro campos no formulário e pronto.\n',
    '<b>✅ Agendamento de clientes em três cliques</b>',
    'Os clientes só precisam escolher o serviço, o horário e clicar no botão.\n',
    '<b>✅ Botão para canal ou chat</b>',
    'Pode ser fixado no canal no canto. Está na moda agora.\n',
    '<b>✅ Lembretes de agendamentos</b>',
    'Lembramos dos agendamentos uma hora antes. E para o cliente também de manhã, para não esquecer.\n',
    '<b>✅ Avaliações de serviços e classificação</b>',
    'Lembramos o cliente de deixar uma avaliação do serviço após o agendamento.\n',
    '<b>✅ Suporte ao vivo</b>',
    'Se algo acontecer, é só me escrever @arslaverza, eu resolvo tudo.'

  ];

  const inline_keyboard = [
    [{ text: 'Começar de graça', callback_data: `trial|start|accountId=${accountId}` }], 
    [{ text: 'Escolher assinatura', web_app: { url: `${config.bot.web}/promo` } }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');

  return { text, parse_mode: 'HTML', reply_markup };
}