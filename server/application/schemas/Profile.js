({
  Entity: {},

  account: 'Account',
  name: 'string',
  description: 'text',
  city: '?string',
  address: '?string',
  termLink: '?string',
  isActive: 'boolean',
  category: 'string',
  specialization: '?string',
  autoConfirm: { type: 'boolean', default: true },
  balance: { type: 'bigint', default: 0 },
  slotDuration: { type: 'number', default: 60 },
})