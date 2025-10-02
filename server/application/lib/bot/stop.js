/* eslint-disable camelcase */
async () => {
  const { active, drop_pending_updates } = config.bot;
  const { id } = application.worker;
  if (id !== 'W1' || !active) return;
  const response = await bus.bot.deleteWebhook({ drop_pending_updates });
  console.debug(response);
  application.scheduler.stop('deliver');
  console.info('Deliver was stopped');
};