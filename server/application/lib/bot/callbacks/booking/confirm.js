/* eslint-disable camelcase */
async ({ chat, message, id, args }) => {
  console.info('lib/bot/callbacks/booking/confirm');
  console.debug({ chat, message, id, args });

  try {
    const ok = await domain.booking.confirm(args);

    const answer = {
      callback_query_id: id,
      text: 'Запись подтверждена',
      show_alert: ok,
    };

    await lib.bot.wrappers.answerCallback(answer);
    return !!ok; // false если не надо удалять исходное сообщение
  } catch (e) {
    console.error(e);
    return false;
  }
};