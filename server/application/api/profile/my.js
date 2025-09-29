({
  access: 'public',

  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) throw new Error('Permission denied', 403);
  },

  method: async ({ accountId, clean }) => {
    console.info('api/profile/my');
    console.debug({ accountId });

    try {
      const profile = await domain.profile.byAccountId({ accountId, clean });
      return profile;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})