async ({ message, data, id }) => {
  console.info('lib/bot/handlers/callback_query');
  console.debug({ message, data, id });

  try {
    const { message_id, chat } = message;
    const { id: chat_id } = chat;

    const [unit, callbackName, ...rest] = data.split('|');
    const args = {};
    for (const arg of rest) {
      const [key, value] = arg.split('=');
      args[key] = value;
    }

    const callback = lib.bot.callbacks[unit][callbackName];
    const ok = await callback({ chat, message, id, args });

    if (ok) lib.bot.wrappers.deleteMessage({ chat_id, message_id });
  } catch (e) {
    console.error(e);
  }
};