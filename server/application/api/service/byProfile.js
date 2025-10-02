({
  access: 'public',
  
  method: async ({ profileId, accountId, isOwner }) => {
    console.info('api/service/byProfile');
    console.debug({ profileId });

    try {
      //const isOwner = await domain.profile.isOwner({ profileId, accountId });
      return await domain.service.byProfile({ profileId, isOwner });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})