({
  async byId({ clientId, full = false }) {
    console.info('domain/client/byId');
    console.debug({ clientId });

    let client = await db.pg.row('Client', { clientId });
    if (full) client = await domain.client.mapper(client);

    return client;
  },

  async byProfileId({ profileId, full = false }) {
    console.info('domain/client/byProfileId');
    console.debug({ profileId });

    const clients = await db.pg.select('Client', { profileId });

    return full ? await Promise.all(clients.map(domain.client.mapper)) : clients;
  },

  async mapper(client) {
    const { accountId, clientId, profileId, refererId: tg } = client;
    const reward = await db.pg.row('AffiliateReward', { accountId, profileId });
    const { info, phone } = await db.pg.row('Account', { accountId });
    const bookings = await db.pg.select('Booking', { clientId });
    const cancelledBookings = bookings.filter(({ state }) => state === 'cancelled');
    const [lastBooking] = await lib.pg.builder.query(lib.pg.queries.booking.lastClientBooking({ clientId })) || [];
    client['lastBooking'] = lastBooking;
    client['bookingCount'] = bookings?.length;
    client['cancelledBookingCount'] = cancelledBookings?.length;
    client['cancelledBookingPercent'] = Math.floor((cancelledBookings?.length / bookings?.length) * 100);
    client['info'] = info;
    client['phone'] = phone;
    client['affiliateReward'] = reward?.balance || 0;
    if (tg) {
      const account = await db.pg.row('Account', { tg });
      if (account) client['refererInfo'] = account.info;
    }

    return client;
  },
})