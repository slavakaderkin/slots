({
  access: 'public',

  
  method: async ({ bookingId }) => {
    console.info('api/booking/confirm');
    console.debug({ bookingId });

    try {
      return await domain.booking.confirm({ bookingId });
      // отправить сообщения
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})