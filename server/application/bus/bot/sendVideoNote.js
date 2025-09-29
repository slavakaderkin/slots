({
  method: {
    post: 'sendVideoNote',
    body: [
      'chat_id',
      'video_note',
      'reply_markup',
      'protect_content',
      'disable_notification',
      'parse_mode',
      'duration',
      'thumbnail',
    ],
  },
});