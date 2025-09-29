({
  access: 'public',
  
  method: async ({ serviceId, accountId }) => {
    console.info('api/service/byId');
    console.debug({ serviceId });

    try {
      return await domain.service.byId({ serviceId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})