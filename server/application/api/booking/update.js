({
  access: 'public',

  
  method: async ({ bookingId, updates }) => {
    console.info('api/booking/update');
    console.debug({ bookingId, updates });

    try {
      await db.pg.update('Booking', updates, { bookingId });
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})