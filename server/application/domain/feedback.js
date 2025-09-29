({
  async create(params) {
    const { bookingId, rating, text, isAnonymous, accountId } = params;
    const { serviceId, profileId } = await db.pg.row('Booking', { bookingId });
    const record = { bookingId, accountId, serviceId, profileId, rating, text, isAnonymous };
    const [feedback] = await db.pg.insert('Feedback', record);
    
    return feedback
  }
})