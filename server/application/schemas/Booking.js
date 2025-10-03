({
  Entity: {},

  profile: 'Profile',
  client: 'Client',
  slot: 'Slot',
  datetime: 'datetime',
  service: 'Service',
  duration: '?number',
  allDay: { type: 'boolean', default: false },
  isPaid: { type: 'boolean', default: false },
  isOnline: { type: 'boolean', default: false },
  meetLink: '?string',
  state: { type: 'string', default: 'pending',
    enum: [
      'pending', 
      'confirmed',
      'completed',
      'cancelled'
    ] 
  },
  createdAt: { type: 'datetime', default: 'now' },
  comment: '?text',
})