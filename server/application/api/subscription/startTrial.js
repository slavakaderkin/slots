({
  access: 'public',

  
  method: async ({ accountId }) => {
    console.info('api/subscription/startTrial');
    console.debug({ accountId });

    try {
      const start = new Date().toISOString();
      const end = lib.utils.modTime(start, 14, 'd');
      const record = { start, end, accountId };
      await db.pg.insert('Trial', record);

      // таск на деактивацию + сообщение
      
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})