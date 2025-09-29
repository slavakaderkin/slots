({
  async router({ method, args, verb, headers }) {
    console.info('api/hook/bot');
    console.debug({ method, verb, headers, args });

    try {
      const type = Object.keys(args)[1];
      const data = args[type];
      await lib.bot.handlers[type](data);
      return {};
    } catch (e) {
      console.error(e);
      // обработать ошибку
      return {};
    }
  },
});