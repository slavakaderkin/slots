({
  access: 'public',

  method: async (service) => {
    console.info('api/service/save');
    console.debug({ service });

    try {
      if (service.serviceId) return await domain.service.update(service);
      else return await domain.service.create(service);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
})