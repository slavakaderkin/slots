({
  access: 'public',

  
  method: async ({ accountId }) => {
    console.info('api/subscription/startTrial');
    console.debug({ accountId });

    try {
      const exists = await db.pg.row('Trial', { accountId });
      if (exists) return false;
      
      const start = new Date().toISOString();
      const end = lib.utils.modTime(start, 14, 'd');
      const record = { start, end, accountId };
      const [trial] = await db.pg.insert('Trial', record);

      const task = {
        name: `cancelTrial_${trial.trialId}`,
        every: lib.utils.dateForPlanner(end),
        run: 'domain.subscription.cancelTrial',
        args: { trialId: trial.trialId },
      };

      await application.scheduler.add(task);

      const account = await db.pg.row('Account', { accountId });
      const msg = await lib.messages.ru.admin.trial({ account });
      await lib.bot.notify.admin({ msg });
      
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})