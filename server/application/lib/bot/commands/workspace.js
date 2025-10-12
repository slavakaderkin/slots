async ({ args }) => {
  console.info('lib/bot/commands/workspace');
  console.debug({ args });

  const { chat: { id: tg } } = args;

  const account = await db.pg.row('Account', { tg });
  const messagePath = 'command.workspace';
  lib.bot.notify.one({ accountId: account.accountId, path: messagePath });
};