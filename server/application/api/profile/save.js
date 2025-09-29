({
  access: 'public',

  method: async (profile) => {
    console.info('api/profile/save');
    console.debug({ profile });

    try {
      if (profile.profileId) return await domain.profile.update(profile);
      else return await domain.profile.create(profile);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
})