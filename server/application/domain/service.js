({
  async create(params) {
    console.info('domain/service/create');
    console.debug({ params });

    const [service] = await db.pg.insert('Service', params);
    return service;
  },

  async update({ serviceId, ...updates }) {
    console.info('domain/service/update');
    console.debug({ serviceId });

    await db.pg.update('Service', updates, { serviceId });
    return true;
  },

  async byProfile({ profileId, isOwner }) {
    console.info('domain/service/byProfile');
    console.debug({ profileId });

    if (isOwner) {
      const where = { profileId, state: 'active' };
      const or = { profileId, state: 'suspended' };
      return await db.pg.select('Service', where, or).order('serviceId');
    } else {
      const where = { profileId, state: 'active' };
      return await db.pg.select('Service', where).order('serviceId');
    } 
  },

  async byId({ serviceId, isOwner }) {
    console.info('domain/service/byId');
    console.debug({ serviceId });
    
    return await db.pg.row('Service', { serviceId });;
  },
})