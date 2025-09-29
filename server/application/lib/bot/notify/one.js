/* eslint-disable camelcase */
async ({ accountId, path, args, store = false }) => {
  console.info('lib/bot/notify/one');
  console.debug({ accountId, path, store });

  /*const { methods } = lib.bot.notify;
  const methodName = methods[format];
  const method = bus.bot[methodName];
  const link_preview_options = { is_disabled: true };
 

  const { result } = await method(item).catch(({ message }) => {
    const code = message.split(' ')[3];
    console.error(`lib/notify/one tg/error/${methodName} code: ${code}`);
    return { result: null };
  });*/

  const { tg: chat_id, info } = await db.pg.row('Account', { accountId });
  if (!info?.allows_write_to_pm) return;
  const lng = info.language_code;
  const key = String(chat_id) + String(new Date().getTime());
  const msg = await lib.bot.notify.getMessage(path, args, lng);
  const { format = 'text', ...rest } = msg;
  const item = { format, chat_id, ...rest, key, store };

  /*if (result && store) {
    const info = { chat_id, message_id: result.message_id };
    lib.bot.deliver.messages.put(key, info);
  }*/

  await lib.bot.deliver.queue.push(item);
  return key;
};


  