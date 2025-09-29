({
  access: 'public',

  validate: async ({ accountId, token, profileId, withBooking }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
    if (withBooking) {
      const isOwner = await domain.profile.isOwner({ accountId, profileId });
      if (isOwner) return new Error('Permission denied', 403);
    }
  },
  
  method: async ({ profileId, withBooking, date }) => {
    console.info('api/slot/byDay');
    console.debug({ profileId, withBooking, date });

    try {
      return await domain.slot.byDay({ profileId, withBooking, date });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})