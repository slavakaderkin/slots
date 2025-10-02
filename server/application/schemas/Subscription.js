({
  Entity: {},

  account: 'Account',
  start: { type: 'datetime', default: 'now' },
  end: { type: 'datetime' },
  level: { type: 'string', enum: ['min', 'max'] },
  isActive: { type: 'boolean', default: true },
}) 