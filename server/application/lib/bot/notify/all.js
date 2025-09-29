/* eslint-disable camelcase */
async ({ path, args, store = false }) => {
  console.info('lib/bot/notify/all');
  console.debug({path, args, store });

  const accounts = await db.pg.select('Account');
  const keys = [];

  for (const { tg: chat_id, info } of accounts) {
    const lng = info.language_code;
    const key = String(chat_id) + String(new Date().getTime());
    const msg = await lib.bot.notify.getMessage(path, args, lng);
    const { format = 'text', ...rest } = msg;
    const item = { chat_id, ...rest, format, key, store };
   
    keys.push(key);
    lib.bot.deliver.queue.push(item);
  }

  return keys;
};