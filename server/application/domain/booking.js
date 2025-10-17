({
  async create(params) {
    console.info('domain/booking/create');
    console.debug({ params });

    const { accountId, clientId, profileId, slotId, serviceId, refererId, ...rest } = params;
    const service = await db.pg.row('Service', { serviceId });
    const { duration, allDay, isOnline } = service;
    
    const isAvailable = await domain.slot.isAvailable(slotId, duration, allDay);
    if (!isAvailable) return false;
    const profile = await db.pg.row('Profile', { profileId });
    const slot = await db.pg.row('Slot', { slotId });

    let client = null;
    if (!clientId) {
      const where = { accountId, profileId };
      client = await db.pg.row('Client', where);
      if (refererId) where['refererId'] = lib.utils.decodeRef(refererId);
      if (!client) [client] = await db.pg.insert('Client', where);
    };
    
    const record = { 
      ...rest,
      profileId,
      slotId,
      serviceId,
      duration,
      allDay,
      isOnline,
      datetime: slot.datetime,
      clientId: clientId || client.clientId,
    };

    if (refererId) record['refererId'] = lib.utils.decodeRef(refererId);;

    let [booking] = await db.pg.insert('Booking', record);

    if (service.autoConfirm || clientId) booking = await domain.booking.confirm({ bookingId: booking.bookingId });
    else domain.booking.scheduleAutoCancel({ bookingId: booking.bookingId });

    const profileAccount = await domain.profile.getAccount({ profileId: booking.profileId });
    const messagePath = 'booking.created';
    const args = { booking, timezone: profileAccount.timezone };
    lib.bot.notify.one({ accountId: profileAccount.accountId, path: messagePath, args });

    return booking;
  },

  async cancel({ bookingId, dontNotify }) {
    console.info('domain/booking/cancel');
    console.debug({ bookingId });

    const booking = await db.pg.row('Booking', { bookingId });
    if (booking.state === 'cancelled') return true;

    const feedback = await db.pg.row('Feedback', { bookingId: booking.bookingId });
    if (feedback) return false;

    const updates = { state: 'cancelled' };
    await db.pg.update('Booking', updates, { bookingId });
    
    if (dontNotify) return true;

    if (booking.state === 'confirmed') await domain.slot.activate(booking.slotId, booking.duration, booking.allDay);
  
    const client = await db.pg.row('Client', { clientId: booking.clientId });
    const account = await db.pg.row('Account', { accountId: client.accountId });
    const profileAccount = await domain.profile.getAccount({ profileId: booking.profileId });
    const messagePath = 'booking.cancelled';
    lib.bot.notify.one({ accountId: account.accountId, path: messagePath, args: { booking, timezone: account.timezone } });
    lib.bot.notify.one({ accountId: profileAccount.accountId, path: messagePath, args: { booking, timezone: profileAccount.timezone } });

    return true;
  },

  async scheduleAutoCancel({ bookingId }) {
    console.info('domain/booking/scheduleAutoCancel');
    console.debug({ bookingId });

    const future = lib.utils.modTime(null, 30, 'mm');

    /*const every = lib.utils.dateForPlanner(future);
    const task = { 
      name: `booking_autoCancel_${bookingId}`,
      every,
      run: 'domain.booking.autoCancel',
      args: { bookingId }
    };

    await application.scheduler.add(task);*/

    const cronString = lib.utils.isoToCron(future, false);
    const schedule = npm['node-schedule'].scheduleJob;
    const task = schedule(cronString, function() {
      domain.booking.autoCancel({ bookingId });
    });
  },

  async autoCancel({ bookingId }) {
    console.info('domain/booking/autoCancel');
    console.debug({ bookingId });

    const booking = await db.pg.row('Booking', { bookingId });
    if (booking.state !== 'pending') return true;

    domain.booking.cancel({ bookingId });

    //const taskName = `booking_autoCancel_${bookingId}`;
    //application.scheduler.stop(taskName);

    return true;
  },

  async confirm({ bookingId }) {
    console.info('domain/booking/confirm');
    console.debug({ bookingId });

    const booking = await db.pg.row('Booking', { bookingId });
    if (booking.state === 'confirmed') return true;
    if (booking.state !== 'pending' || booking.state === 'cancelled') return false;

    const { slotId, duration, allDay, profileId } = booking;
    const isAvailable = await domain.slot.isAvailable(slotId, duration, allDay);
    if (!isAvailable) {
      // сообщение, что слоты заняты 
      return false;
    }

    const updates = { state: 'confirmed' };
    const [updated] = await db.pg.update('Booking', updates, { bookingId });
    await domain.slot.deactivate(booking.slotId, booking.duration, booking.allDay);

    const { accountId } = await db.pg.row('Client', { clientId: booking.clientId });
    const profile = await db.pg.row('Profile', { profileId });
    const profileAccount = await db.pg.row('Account', { accountId: profile.accountId });
    const { timezone } = await db.pg.row('Account', { accountId });
    const messagePath = 'booking.confirmed';
    const args = { booking: updated, timezone, accountId };
    const profileArgs = { ...args, accountId: profileAccount.accountId, timezone: profileAccount.timezone }
    lib.bot.notify.one({ accountId, path: messagePath, args });
    lib.bot.notify.one({ accountId: profileAccount.accountId, path: messagePath, args: profileArgs });
    domain.booking.scheduleNotifications({ booking: updated, accountId });

    //const taskName = `booking_autoCancel_${bookingId}`;
    //application.scheduler.stop(taskName);

    const slots = await domain.slot.getAvailableSlots({ profileId });
    if (slots?.length === 0) {
      const messagePath = 'slot.ended';
      lib.bot.notify.one({ accountId: profileAccount.accountId, path: messagePath });
    }

    return updated;
  },

  async notify({ bookingId, accountId, isDayly }) {
    console.info('domain/booking/notify');
    console.debug({ bookingId, accountId, isDayly });

    const booking = await db.pg.row('Booking', { bookingId });
    if (booking.state !== 'confirmed') return;

    const { profileId } = booking;
    const profileAccount = await domain.profile.getAccount({ profileId });
    const { timezone } = await db.pg.row('Account', { accountId });

    const messagePath = 'booking.notification';
    const args = { timezone, isDayly, booking, accountId };
    lib.bot.notify.one({ accountId, path: messagePath, args });

    if (!isDayly) {
      const profileArgs = { ...args, timezone: profileAccount.timezone , accountId: profileAccount.accountId };
      lib.bot.notify.one({ accountId: profileAccount.accountId, path: messagePath, args: profileArgs });
    }
  },

  async scheduleNotifications({ booking, accountId }) {
    console.info('domain/booking/scheduleNotification');
    console.debug({ booking, accountId });

    const { datetime, bookingId } = booking;
    const { timezone } = await db.pg.row('Account', { accountId });

    // дневное уведомление
    const date = new Date(lib.utils.setSpecificTime(datetime));

    if (date > new Date()) {
      /*const daylyEvery = lib.utils.dateForPlanner(server9AM);
      const daylyTask = {
        name: `daylyNotification_${bookingId}`,
        every: daylyEvery,
        run: 'domain.booking.notify',
        args: { bookingId, accountId, isDayly: true },
      }
      await application.scheduler.add(daylyTask);*/

      // 
      const dateObject = {
        year: date.getFullYear(),
        month: date.getMonth(), // 0-11
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        tz: timezone
      };
      const schedule = npm['node-schedule'].scheduleJob;
      const task = schedule(dateObject, function() {
        domain.booking.notify({ bookingId, accountId, isDayly: true });
      });
    }
  
    // уведомление за 1 час
    const before = new Date(lib.utils.modTime(datetime, -1, 'h'));

    if (before > new Date()) {
      /*const beforeEvery = lib.utils.dateForPlanner(beforeTime);
      const beforeTask = {
        name: `beforeNotification_${bookingId}`,
        every: beforeEvery,
        run: 'domain.booking.notify',
        args: { bookingId, accountId, isDayly: false },
      }
      await application.scheduler.add(beforeTask);*/

      const cronString = lib.utils.isoToCron(before.toISOString(), false);
      const schedule = npm['node-schedule'].scheduleJob;
      const task = schedule(cronString, function() {
        domain.booking.notify({ bookingId, accountId, isDayly: false });
      });
    }

  }, 

  async complete({ booking }) {
    console.info('domain/booking/complete');
    console.debug({ booking });

    const { bookingId, clientId, datetime } = booking;
    const { accountId } = await db.pg.row('Client', { clientId });
    const { timezone } = await db.pg.row('Account', { accountId });

    const { isNight } = lib.utils.getTimeInfo(datetime, timezone);
    if (isNight) return false;
    
    const updates = { state: 'completed' };
    const [updated] = await db.pg.update('Booking', updates, { bookingId });

    const messagePath = 'booking.completed';
    const args = { booking: updated, timezone };
    lib.bot.notify.one({ accountId, path: messagePath, args });
    return true;
  },

  async getProfileBookings({ profileId, kind, limit, offset }) {
    console.info('domain/booking/getProfileBookings');
    console.debug({ profileId, kind });

    const query = lib.pg.queries.booking.byProfileId({ profileId, kind, limit, offset });
    const records = await lib.pg.builder.query(query);
    const profile = await db.pg.row('Profile', { profileId });
    
    const mapper = async (booking) => {
      booking['profile'] = profile;
      booking['client'] = await domain.client.byId({ clientId: booking.clientId, full: true });
      booking['service'] = await domain.service.byId({ serviceId: booking.serviceId });
      booking['slot'] = await db.pg.row('Slot', { slotId: booking.slotId });
      return booking;
    };

    return await Promise.all(records.map(mapper));
  },

  async getAccountBookings({ accountId, kind, limit, offset }) {
    console.info('domain/booking/getAccountBookings');
    console.debug({ accountId, kind, limit, offset });

    const query = lib.pg.queries.booking.byAccountId({ accountId, kind, limit, offset });
    const records = await lib.pg.builder.query(query);

    const mapper = async (booking) => {
      booking['profile'] = await domain.profile.byId({ profileId: booking.profileId });
      booking['service'] = await domain.service.byId({ serviceId: booking.serviceId });
      booking['slot'] = await db.pg.row('Slot', { slotId: booking.slotId });

      return booking;
    };

    return await Promise.all(records.map(mapper));
  },

  async getClientBookings({ clientId, profileId, offset, limit }) {
    console.info('domain/booking/getClientBookings');
    console.debug({ clientId, profileId, offset, limit });

    const { accountId } = await db.pg.row('Client', { clientId });
    const query = lib.pg.queries.booking.byAccountId({ accountId, profileId, offset, limit });
    const records = await lib.pg.builder.query(query);

    const mapper = async (booking) => {
      booking['profile'] = await domain.profile.byId({ profileId: booking.profileId });
      booking['service'] = await domain.service.byId({ serviceId: booking.serviceId });
      booking['slot'] = await db.pg.row('Slot', { slotId: booking.slotId });

      return booking;
    };

    return await Promise.all(records.map(mapper));
  },

  async byId({ bookingId }) {
    console.info('domain/booking/byId');
    console.debug({ bookingId });

    const booking = await db.pg.row('Booking', { bookingId });
    booking['client'] = await domain.client.byId({ clientId: booking.clientId, full: true })
    booking['profile'] = await domain.profile.byId({ profileId: booking.profileId });
    booking['service'] = await domain.service.byId({ serviceId: booking.serviceId });
    booking['slot'] = await db.pg.row('Slot', { slotId: booking.slotId });

    return booking;
  },

  async getFeedback({ bookingId }) {
    console.info('domain/booking/getFeedback');
    console.debug({ bookingId });

    return await db.pg.row('Feedback', { bookingId });
  }
});
