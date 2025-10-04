async ({ args, ref }) => {
  console.info('lib/bot/commands/start');
  console.debug({ args, ref });

  const { chat: { id: tg }, from } = args;
  let account = await db.pg.row('Account', { tg });
  if (!account) account = account = await domain.account.init({ data: from });
  const messagePath = 'command.start';
  lib.bot.notify.one({ accountId: account.accountId, path: messagePath });
};