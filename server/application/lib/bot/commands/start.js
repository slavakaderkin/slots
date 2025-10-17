async ({ args, ref = '' }) => {
  console.info('lib/bot/commands/start');
  console.debug({ args, ref });

  const { chat: { id: tg }, from } = args;
  const { language_code } = from;

  const commands = lib.messages[language_code] 
    ?  lib.messages[language_code].commands()
    :  lib.messages['en'].commands();
  const scope = JSON.stringify({
    chat_id: tg,
    type: 'chat',
  });

  await bus.bot.setMyCommands({ commands, scope, language_code });

  let account = await db.pg.row('Account', { tg });
  if (!account) account = account = await domain.account.init({ data: { ...from, allows_write_to_pm: true }, ref });
  const messagePath = 'command.start';
  lib.bot.notify.one({ accountId: account.accountId, path: messagePath, args: { account } });
};