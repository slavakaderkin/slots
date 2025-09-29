async ({ chat_id, message_id }) => {
  await bus.bot.deleteMessage({ chat_id, message_id })
    .catch(({ message }) => {
      const code = message.split(' ')[3];
      console.error(
        `lib/bot/wrappers/deleteMessage tg/error/${method} code: ${code}`
      );
    });
};