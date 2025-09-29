({
  access: 'public',

  method: async ({ profileId, accountId }) => {
    console.info('api/profile/sendToChat');
    console.debug({ profileId, accountId });

    try {
      const profile = await domain.profile.byId({ profileId });
      const messagePath = 'profile.sendToChat';
      await lib.bot.notify.one({ accountId, path: messagePath, args: { profile } });
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})