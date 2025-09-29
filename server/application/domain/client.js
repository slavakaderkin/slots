({
  async byId({ clientId, full = false }) {
    console.info('domain/client/byId');
    console.debug({ clientId });

    const client = await db.pg.row('Client', { clientId });
    if (full) {
      const { accountId } = client;
      const { info } = await db.pg.row('Account', { accountId })
      client['info'] = info
    }

    return client;
  },

  async byProfileId({ profileId, full = false }) {
    console.info('domain/client/byProfileId');
    console.debug({ profileId });

    const clients = await db.pg.select('Client', { profileId });
    const mapper = async (client) => {
      const { accountId } = client;
      const { info } = await db.pg.row('Account', { accountId })
      client['info'] = info;
      return client;
    };
    
    return full ? await Promise.all(clients.map(mapper)) : clients;
  },
})