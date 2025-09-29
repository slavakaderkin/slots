({
  access: 'public',

  validate: async ({ accountId, token }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
  },
  
  method: async ({ bookingId }) => {
    console.info('api/feedback/byBooking');
    console.debug({ bookingId });

    try {
      return await domain.booking.getFeedback({ bookingId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})