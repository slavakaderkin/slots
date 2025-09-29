async (params) => {
  console.info('lib/bot/handlers/pre_checkout_query');
  console.debug({ params });

  const { id, invoice_payload, order_info, from } = params;

  try {
    const [entity, id] = invoice_payload.split('_');

    // логика обновления состояния paid и обновление балансов, при необходимости
    const answer = { pre_checkout_query_id: id, ok: true }; // ok в ответе от доменной логики
    const { ok, result } = await lib.bot.wrappers.answerPreCheckoutQuery(answer);
  
    if (ok && result) {
      // уведомления что ок
    } else {
      // откат, удаление сущности итд
    }
  } catch (e) {
    console.error(e);
    
    await lib.bot.wrappers.answerPreCheckoutQuery(answer);
  }
};