({
  access: 'public',
  
  method: async ({ code, q = 'Mo' }) => {
    console.info('api/geo/citiesByCode');
    console.debug({ code, q });

    try {
      
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})