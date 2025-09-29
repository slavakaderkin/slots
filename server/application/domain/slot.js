({
  async create(params) {
    console.info('domain/slot/create');
    console.debug({ params });

    await db.pg.insert('Slot', params);
    return true;
  },

  async delete(slotId) {
    console.info('domain/slot/delete');
    console.debug({ slotId });

    const booking = await db.pg.row('Booking', { slotId });
    if (booking) return false;
    await db.pg.delete('Slot', { slotId });
    return true;
  },

  async mySlots({ profileId, withBooking }) {
    console.info('domain/slot/mySlots');
    console.debug({ profileId, withBooking });

    const now = new Date().toISOString();
    const datetime = `>=${now}`;
    const records = await db.pg.select('Slot', { profileId, datetime });

    const mapper = async (slot) => {
      const { slotId } = slot;
      const booking = await db.pg.row('Booking', { slotId, state: 'confirmed' });
      if (booking) {
        const { clientId } = booking;
        booking['client'] = await domain.client.byId({ clientId, full: true });
        slot['booking'] = booking;
      }
      return slot;
    };

    const slots = withBooking ? await Promise.all(records.map(mapper)): records;
    return slots;
  },

  async byDay({ profileId, date, withBooking }) {
    console.info('domain/slot/byDay');
    console.debug({ profileId, date });

    const query = lib.pg.queries.slot.byDay({ profileId, date });
    const records = await lib.pg.builder.query(query);

    const mapper = async (slot) => {
      const { slotId } = slot;
      const booking = await db.pg.row('Booking', { slotId, state: 'confirmed' });
      if (booking) {
        const { clientId, serviceId } = booking;
        booking['service'] = await domain.service.byId({ serviceId });
        booking['client'] = await domain.client.byId({ clientId, full: true });
        slot['booking'] = booking;
      }
      return slot;
    };

    const slots = withBooking ? await Promise.all(records.map(mapper)): records;
    return slots;
  },

  async getAvailableSlots({ profileId }) {
    console.info('domain/slot/getAvailableSlots');
    console.debug({ profileId });

    const query = lib.pg.queries.slot.available({ profileId });
    const slots = await lib.pg.builder.query(query);
    return slots;
  },

  async getUpcomingSlot({ profileId }) {
    console.info('domain/slot/getUpcomingSlot');
    console.debug({ profileId });

    const query = lib.pg.queries.slot.upcoming({ profileId });
    const [slot] = await lib.pg.builder.query(query);
    return slot;
  },

  async isAvailable(slotId, duration = 60, allDay) {
    console.info('domain/slot/isAvailable');
    console.debug({ slotId });
    
    const slot  = await db.pg.row('Slot', { slotId });
    if (duration <= 60 && !allDay) return slot.isAvailable;
    const { datetime, profileId } = slot;
    const query = lib.pg.queries.slot.nexts({ datetime, duration, allDay, profileId });
    const slots = await lib.pg.builder.query(query);
    return slots.every(({ isAvailable, isBlocked }) => isAvailable && !isBlocked);
  },

  async deactivate(slotId, duration = 60, allDay) {
    console.info('domain/slot/deactivate');
    console.debug({ slotId });

    const [first] = await db.pg.update('Slot', { isAvailable: false, isBlocked: true }, { slotId });
    const { profileId, datetime } = first;
    if (duration > 60 || allDay) {
      const params = { datetime, duration, isBlocked: true, allDay, profileId };
      const query = lib.pg.queries.slot.update(params);
      await lib.pg.builder.query(query);
    }
    
    return true;
  },

  async activate(slotId, duration = 60, allDay) {
    console.info('domain/slot/activate');
    console.debug({ slotId });

    const [first] = await db.pg.update('Slot', { isAvailable: true, isBlocked: false }, { slotId });
    const { datetime, profileId } = first;
    if (duration > 60 || allDay) {
      const params = { datetime, duration, isBlocked: false, allDay, profileId };
      const query = lib.pg.queries.slot.update(params);
      await lib.pg.builder.query(query);
    }
    
    return true;
  },
})