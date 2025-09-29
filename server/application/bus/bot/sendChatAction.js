({
  parameters: {
    chat_id: 'number',
    action: 'string',
  },
  method: {
    post: 'sendChatAction',
    body: ['chat_id', 'action'],
  },
});