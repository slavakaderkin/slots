({
  Entity: {},

  token: { type: 'string', unique: true },
  datetime: { type: 'datetime', default: 'now' },
  account: 'Account',
  ip: 'ip',
  data: 'json',
});
