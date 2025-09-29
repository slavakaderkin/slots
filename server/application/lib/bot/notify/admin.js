/* eslint-disable camelcase */
async ({ msg }) => {
  console.info('lib/bot/notify/admin');
  console.debug({ msg });
  const { format = 'text', ...rest } = msg;
  const { adminId: chat_id } = config.bot
  const { methods } = lib.bot.notify;
  const methodName = methods[format];
  const method = bus.bot[methodName];
  const link_preview_options = { is_disabled: true };
  const item = { chat_id, ...rest, link_preview_options };
  const key = String(config.bot.adminId) + String(new Date().getTime());
 
  await method(item).catch(({ message }) => {
    const code = message.split(' ')[3];
    console.error(`lib/notify/admin tg/error/${method} code: ${code}`);
    return { result: null };
  });

  return key;
};