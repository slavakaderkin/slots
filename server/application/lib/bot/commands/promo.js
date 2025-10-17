async ({ args, ref, text }) => {
  console.info('lib/bot/commands/promo');
  console.debug({ args });

  const { chat: { id: tg } } = args;

  const account = await db.pg.row('Account', { tg });
  const messagePath = 'promo';
  const messageArgs = { text, ref: ref || tg };
  lib.bot.notify.one({ accountId: account.accountId, path: messagePath, args: messageArgs });
};