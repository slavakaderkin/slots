/* eslint-disable camelcase */
async () => {
  const { hook: url, active, allowed_updates, drop_pending_updates } = config.bot;
  const { id } = application.worker;
  if (id !== 'W1' || !active) return;
  const params = { url, allowed_updates, drop_pending_updates };
  const response = await bus.bot.setWebhook(params);
  console.debug(response);
  //const task = { name: 'deliver', every: '1s', run: 'lib.bot.deliver.queue.loop' };
  
  const runDeliver = async () => {
    lib.bot.deliver.queue.loop();
    //await application.scheduler.add(task);
   // console.info('Deliver was started');
  };

  setInterval(runDeliver, 2000);
};