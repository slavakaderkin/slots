({
  access: 'public',
  
  method: async () => {
    console.info('api/geo/countries');
    console.debug();

    try {
      const buffer = application.resources.get('/countries.json');
      const json = buffer.data.toString();
      const parsed = JSON.parse(json);
      const countries = parsed.map(
        ({ name, native, emoji, iso2: code, currency }) => ({ name, native, emoji, code, currency })
      );

      return countries;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})