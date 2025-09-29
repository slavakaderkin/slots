({
  access: 'public',

  
  method: async (booking) => {
    console.info('api/booking/create');
    console.debug({ booking });

    try {
      return await domain.booking.create(booking);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})