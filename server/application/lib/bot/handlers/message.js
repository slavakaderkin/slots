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
      const [line, ...rest] = args.text.split('\n');
      const [first, ref] = line.slice(1).split(' ');
      const text = rest?.join('\n')?.trim() || '';
      const command = first.trim();

      lib.bot.commands[command]({ args, ref: ref?.trim(), text });
    } else if (text) {
      // какая-то другая логика
    } else {
      console.warn('Uknown msg type', args);
    }
  } catch (e) {
    console.error(e);
  }
};