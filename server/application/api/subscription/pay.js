({
  access: 'public',

  
  method: async ({ accountId, level, type, subscriptionId }) => {
    console.info('api/subscription/pay');
    console.debug({ accountId, level, type });

    try {
      const { info } = await db.pg.row('Account', { accountId });
      const messages = lib.messages[info?.language_code] || lib.messages['en'];

      const params = await messages.subscription.invoice({ accountId, level, type, subscriptionId });
      const { result: invoice } = await bus.bot.createInvoiceLink(params).catch(() => ({}));
      
      return invoice;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
})