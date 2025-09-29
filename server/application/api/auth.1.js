({
  async router({ method, args, verb, headers }) {
    console.info('api/hook/auth');
    console.debug({ method, verb, headers, args });

    try {
     
      return {};
    } catch (e) {
      console.error(e);
      // обработать ошибку
      return {};
    }
  },
});