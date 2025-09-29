({
  Entity: {},

  phone: '?string',
  tg: '?bigint',
  info: '?json',
  registered: { type: 'datetime', default: 'now' },
  lastSeen: { type: 'datetime', default: 'now' },
  isBanned: { type: 'boolean', default: false },
  timezone: '?string',
});
