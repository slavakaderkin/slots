async (params) => {
  await bus.bot.answerCallbackQuery(params)
    .then(() => ({ ok: true }))
    .catch(({ message }) => {
      const code = message.split(' ')[3];
      console.error(
        `lib/bot/wrappers/answerCallback tg/error/${method} code: ${code}`
      );
    });
};