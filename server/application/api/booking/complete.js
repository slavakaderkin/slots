({
  access: 'public',

  validate: async ({ accountId, token, profileId }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
    const isOwner = await domain.profile.isOwner({ accountId, profileId });
    if (isOwner) return new Error('Permission denied', 403);
  },
  
  method: async ({ bookingId }) => {
    console.info('api/booking/complete');
    console.debug({ bookingId });

    try {
      const booking = await db.pg.row('Booking', { bookingId });
      return await domain.booking.complete({ booking });
      // отправить сообщения
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})