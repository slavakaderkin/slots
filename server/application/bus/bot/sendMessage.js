({
  method: {
    post: `sendMessage`,
    body: [
      'business_connection_id',
      'chat_id',
      'text',
      'parse_mode',
      'reply_markup',
      'entities',
      'protect_content',
      'disable_notification',
      'link_preview_options',
      'allow_paid_broadcast',
      'message_effect_id',
      'reply_parameters'
    ],
  },
});