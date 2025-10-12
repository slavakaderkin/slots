async ({ args }) => {
  console.info('lib/bot/commands/account');
  console.debug({ args });

  const { chat: { id: tg } } = args;

  const account = await db.pg.row('Account', { tg });
  const messagePath = 'command.account';
  lib.bot.notify.one({ accountId: account.accountId, path: messagePath });
};