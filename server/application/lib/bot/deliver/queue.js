/* eslint-disable camelcase */
({
  errors: new Map(),

  async handleError(item) {
    // какая-то логика обработки потом
  },

  async push(item) {
    await db.redis.client.lPush('deliver', JSON.stringify(item));
  },

  async pop() {
    const item = await db.redis.client.rPop('deliver');
    return JSON.parse(item);
  },

  getMethod(format) {
    const { methods } = lib.bot.notify;
    const methodName = methods[format || 'text'];
    const method = bus.bot[methodName];

    return method;
  },

  async send(parsed) {
    const { id, format, key, store, ...msg } = parsed;
    const method = lib.bot.deliver.queue.getMethod(format);
    const prepared = { ...msg, link_preview_options: { is_disabled: true } };

    const { result } = await method(prepared).catch(({ message }) => {
      const code = message.split(' ')[3];
      console.error(`lib/bot/deliver/queue/send tg/error code: ${code}`);
      return { result: null };
    });

    if (!result) {
      await lib.bot.deliver.queue.handleError({ ...parsed, id });
    }

    if (result && store) {
      const info = { chat_id: msg.chat_id, message_id: result.message_id };
      await lib.bot.deliver.messages.put(key, info);
    }
  },

  async loop(args = null) {
    const count = config.bot.limits.messages
    //console.warn('From deliver loop')
    for (let i = 0; i < count; i++) {
      const item = await lib.bot.deliver.queue.pop();
      if (!item) break; 
      try {
        await lib.bot.deliver.queue.send(item);
      } catch (e) {
        console.error(e);
        await lib.bot.deliver.queue.handleError(item);
      }
    }
  },
});