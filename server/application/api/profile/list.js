({
  access: 'public',

  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) throw new Error('Permission denied', 403);
  },

  method: async ({ accountId }) => {
    console.info('api/profile/list');
    console.debug({ accountId });

    try {
      return await domain.profile.listByAccount({ accountId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})