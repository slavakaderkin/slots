async (params) => {
  console.info('lib/bot/handlers/pre_checkout_query');
  console.debug({ params });

  const { id, invoice_payload, order_info, from, total_amount: amount } = params;

  // может стоит тут что-то делать, но похуй
  // всю логику обновления подписок унес в SuccessfulPayment Update
  
  try {
    const answer = { pre_checkout_query_id: id, ok: true }; 
    await lib.bot.wrappers.answerPreCheckoutQuery(answer);
   
  } catch (e) {
    console.error(e);
    const answer = { pre_checkout_query_id: id, ok: false };
    await lib.bot.wrappers.answerPreCheckoutQuery(answer);
  }
};