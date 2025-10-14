({
  access: 'public',

  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) throw new Error('Permission denied', 403);
  },
  
  method: async ({ profileId }) => {
    console.info('api/profile/byId');
    console.debug({ profileId });

    try {
      const profile = await domain.profile.byId({ profileId });
      return profile;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})