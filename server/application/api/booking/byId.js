({
  access: 'public',
  
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