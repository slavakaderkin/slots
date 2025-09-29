({
  access: 'public',

  validate: async ({ accountId, token, profileId }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
    const isOwner = await domain.profile.isOwner({ accountId, profileId });
    if (isOwner) return new Error('Permission denied', 403);
  },
  
  method: async ({ profileId, clientId }) => {
    console.info('api/booking/byClient');
    console.debug({ profileId, clientId });

    try {
      return await domain.booking.getClientBookings({ profileId, clientId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})