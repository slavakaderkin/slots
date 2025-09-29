({
  access: 'public',

  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) throw new Error('Permission denied', 403);
  },
  
  method: async ({ accountId, limit, offset }) => {
    console.info('api/booking/byAccount');
    console.debug({ accountId });

    try {
      return await domain.booking.getAccountBookings({ accountId, limit, offset });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})