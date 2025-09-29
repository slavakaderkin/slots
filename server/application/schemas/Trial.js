({
  Entity: {},

  account: 'Account',
  profile: 'Profile',
  start: { type: 'datetime', default: 'now' },
  end: { type: 'datetime' },
  isExpired: { type: 'boolean', default: false },
})