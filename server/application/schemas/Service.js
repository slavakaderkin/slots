({
  Entity: {},

  profile: 'Profile',
  name: 'string',
  description: '?text',
  price: 'bigint',
  isOnline: { type: 'boolean', default: false },
  allDay: { type: 'boolean', default: false },
  isVisits: { type: 'boolean', default: false },
  autoConfirm: { type: 'boolean', default: true },
  state: { 
    type: 'string', 
    enum: ['active', 'suspended', 'arhived'], 
    default: 'active'
  },
  duration: { type: 'number', default: 60, required: false },
})