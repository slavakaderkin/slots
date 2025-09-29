({
  access: 'public',

  
  method: async ({ bookingId }) => {
    console.info('api/booking/cancel');
    console.debug({ bookingId });

    try {
      return await domain.booking.cancel({ bookingId });
      // отправить сообщения
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})