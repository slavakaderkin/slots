/* eslint-disable camelcase */
async ({ chat, message, id, args }) => {
  console.info('lib/bot/callbacks/trial/start');
  console.debug({ chat, message, id, args });

  try {
    const { accountId } = args;
    const ok = await api.subscription.startTrial({ accountId });
 
    if (ok) {
      const messagePath = 'subscription.trialStarted';
      lib.bot.notify.one({ accountId, path: messagePath });
    } else {
      const answer = {
        callback_query_id: id,
        text: 'У вас уже был пробный период',
        show_alert: ok,
      };
  
      await lib.bot.wrappers.answerCallback(answer);
    }
 
    return ok; // false если не надо удалять исходное сообщение
  } catch (e) {
    console.error(e);
    return false;
  }
};