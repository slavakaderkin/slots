({
  Entity: {},

  account: 'Account',
  name: 'string',
  description: 'text',
  country: '?string',
  city: '?string',
  address: '?string',
  mapLink: '?string',
  termLink: '?string',
  isActive: 'boolean',
  category: 'string',
  specialization: '?string',
  balance: { type: 'bigint', default: 0 },
  slotDuration: { type: 'number', default: 60 },
})