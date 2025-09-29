async ({ args, ref }) => {
  console.info('lib/bot/commands/start');
  console.debug({ args, ref });

  const { chat: { id: tg } } = args;
  const { accountId } = await db.pg.row('Account', { tg });
  const messagePath = 'command.start';
  lib.bot.notify.one({ accountId, path: messagePath });
};