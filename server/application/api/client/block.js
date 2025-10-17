({
  access: 'public',

  validate: async ({ accountId, token, profileId }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
    const isOwner = await domain.profile.isOwner({ accountId, profileId });
    if (isOwner) return new Error('Permission denied', 403);
  },
  
  method: async ({ clientId }) => {
    console.info('api/client/block');
    console.debug({ clientId });

    try {
      await db.pg.update('Client', { isBanned: true }, { clientId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})