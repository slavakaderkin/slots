({
  method: {
    post: 'sendDocument',
    body: [
      'chat_id',
      'document',
      'caption',
      'caption_entities',
      'reply_markup',
      'protect_content',
      'disable_notification',
      'disable_content_type_detection',
      'parse_mode',
    ],
  },
});