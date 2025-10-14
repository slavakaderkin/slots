({
  access: 'public',
  
  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) throw new Error('Permission denied', 403);
  },
  
  method: async ({ bookingId }) => {
    console.info('api/booking/byId');
    console.debug({ bookingId });

    try {
      return await domain.booking.byId({ bookingId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})