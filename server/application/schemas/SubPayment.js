({
  Entity: {},

  subscription: 'Subscription',
  date: { type: 'datetime', default: 'now' },
  amount: 'bigint',
  state: { type: 'string', enum: ['pending', 'completed', 'refunded'] },
})