({
  access: 'public',

  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
  },
  
  method: async (params) => {
    console.info('api/feedback/create');
    console.debug({ params });

    try {
      return await domain.feedback.create(params);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})