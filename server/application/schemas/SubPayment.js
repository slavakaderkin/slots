({
  Entity: {},

  subscription: 'Subscription',
  date: { type: 'datetime', default: 'now' },
  amount: 'bigint',
  type: { type: 'string', enum: ['month', 'year'] },
  state: { type: 'string', enum: ['pending', 'completed', 'refunded'] },
  paymentData: '?json'
})