({
  access: 'public',

  
  method: async ({ accountId }) => {
    console.info('api/subscription/byAccount');
    console.debug({ accountId });

    try {
      return await domain.subscription.byAccount({ accountId });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})