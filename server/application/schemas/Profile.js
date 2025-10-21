({
  Entity: {},

  account: 'Account',
  name: 'string',
  description: 'text',
  country: '?string',
  currency: '?string',
  city: '?string',
  address: '?string',
  mapLink: '?string',
  termLink: '?string',
  isActive: 'boolean',
  category: 'string',
  specialization: '?string',
  balance: { type: 'bigint', default: 0 },
  slotDuration: { type: 'number', default: 60 },
  affiliateReward: { type: 'number', required: false, default: 0 }, // percent
  //affileateProgramType: { type: 'string', enum: ['once', 'period'], default: 'once' },
  //affiliateProgramPeriod: { type: 'number', default: 1 } // 1-12 month
})