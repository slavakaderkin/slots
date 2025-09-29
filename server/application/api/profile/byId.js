({
  access: 'public',

  method: async ({ profileId }) => {
    console.info('api/profile/byId');
    console.debug({ profileId });

    try {
      const profile = await domain.profile.byId({ profileId });
      return profile;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})