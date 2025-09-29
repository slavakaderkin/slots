({
  method: {
    post: 'sendVoice',
    body: [
      'chat_id',
      'voice',
      'caption',
      'caption_entities',
      'reply_markup',
      'protect_content',
      'disable_notification',
    ],
  },
});