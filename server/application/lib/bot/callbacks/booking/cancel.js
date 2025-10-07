/* eslint-disable camelcase */
async ({ chat, message, id, args }) => {
  console.info('lib/bot/callbacks/booking/cancel');
  console.debug({ chat, message, id, args });

  try {
    const { id: bookingId, not, ...rest } = args;
    const ok = await domain.booking.cancel({ ...rest, bookingId, dontNotify: !!not });

    const answer = {
      callback_query_id: id,
      text: 'Запись отменена',
      show_alert: ok,
    };

    await lib.bot.wrappers.answerCallback(answer);
    return !!ok; // false если не надо удалять исходное сообщение
  } catch (e) {
    console.error(e);
    return false;
  }
};