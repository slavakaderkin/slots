async (args) => {
  console.info('lib/bot/handler/message');
  console.debug({ args });

  try {
    const { text, from, successful_payment: payment, contact } = args;

    if (payment) {
      lib.bot.handlers.payment({ payment, from });
      return;
    }

    if (contact) {
      lib.bot.handlers.contact({ contact });
      return;
    }

    // нужен парсер сообщения и роутинг на обработчик

    if (lib.bot.utils.isCommand(text)) {
      const [first, ref] = args.text.slice(1).split(' ');
      const command = first.trim()
      lib.bot.commands[command]({ args, ref });
    } else if (text) {
      // какая-то другая логика
    } else {
      console.warn('Uknown msg type', args);
    }
  } catch (e) {
    console.error(e);
  }
};