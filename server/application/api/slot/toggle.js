({
  access: 'public',

  validate: async ({ accountId, token, profileId }) => {
    const session = await db.pg.row('Session', { accountId, token });
    if (!session) return new Error('Permission denied', 403);
    const isOwner = await domain.profile.isOwner({ accountId, profileId });
    if (isOwner) return new Error('Permission denied', 403);
  },
  
  method: async ({ profileId, datetime }) => {
    console.info('api/slot/toggle');
    console.debug({ profileId, datetime });

    try {
      const slot = await db.pg.row('Slot', { profileId, datetime });
      if (slot) return await domain.slot.delete(slot.slotId);
      else return await domain.slot.create({ profileId, datetime });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})