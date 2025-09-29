async (answer) => (await bus.bot.answerPreCheckoutQuery(answer)
  .catch(({ message }) => {
    const code = message.split(' ')[3];
    console.error(
      `lib/bot/handlers/pre_checkout_query tg/error/answerPreCheckoutQuery code: ${code}`
    );
    return { ok: false, result: false };
  })
);