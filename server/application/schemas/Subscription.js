({
  Entity: {},

  account: 'Account',
  profile: 'Profile',
  start: { type: 'datetime', default: 'now' },
  end: { type: 'datetime' },
  type: { type: 'string', enum: ['month', 'year'] },
  level: { type: 'string', enum: ['min', 'max'] },
  isActive: { type: 'boolean' },
})