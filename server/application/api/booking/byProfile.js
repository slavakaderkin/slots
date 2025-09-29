({
  access: 'public',

  validate: async ({ accountId, token, profileId }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
    const isOwner = await domain.profile.isOwner({ accountId, profileId });
    if (isOwner) return new Error('Permission denied', 403);
  },
  
  method: async ({ profileId, kind, offset, limit }) => {
    console.info('api/booking/byProfile');
    console.debug({ profileId, offset, limit });

    try {
      return await domain.booking.getProfileBookings({ profileId, offset, limit, kind });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})