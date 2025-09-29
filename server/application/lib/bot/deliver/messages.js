/* eslint-disable camelcase */
({
  async put(key, info) {
    await db.redis.client.set(key, JSON.stringify(info));
  },

  async get(key) {
    return JSON.parse(await db.redis.client.get(key));
  },

  async del(...keys) {
    for (const key of keys) {
      const json = await db.redis.client.get(key);
      const info = JSON.parse(json);
      if (info) {
        const message_id = Number(info.message_id);
        const chat_id = Number(info.chat_id);
        await bus.bot.deleteMessage({ message_id, chat_id })
          .catch(({ message }) => {
            const code = message.split(' ')[3];
            console.error(`lib/bot/deliver/messages/delete tg/error/deleteMessage`);
          });
        await db.redis.client.del(key);
        await lib.wait({ delay: 1000 / config.bot.limits.messages });
      }
    }
  },
});