({
  access: 'public',

  method: async ({ profileId, accountId, refererId = '' }) => {
    console.info('api/profile/sendToChat');
    console.debug({ profileId, accountId, refererId });

    try {
      const profile = await domain.profile.byId({ profileId });
      const messagePath = 'profile.sendToChat';
      const args = { profile, refererId: lib.utils.encodeRef(refererId) };
      await lib.bot.notify.one({ accountId, path: messagePath, args });
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})