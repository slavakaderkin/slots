export default {
  profile: {
    field: {
      picture: 'Choose image',
      name: 'Name or title',
      description: 'Description',
      specialization: 'Specialization',
      category: 'Field of activity',
      country: 'Country',
      mapLink: 'Link on Google/etc maps',
      address: 'Address',
      slotDuration: 'Slot step',
    },
    hint: {
      picture: 'JPG or PNG format works',
      name: '',
      description: '',
      country: 'Choose the country where your clients are located or you are.',
      specialization: 'Who you are in two words: nail technician, lawyer, plumber, magician, etc...',
      category: '',
      mapLink: 'Clients can find you on the map by clicking the link. ',
      mapLink_link: 'Where to get the link >',
      address: 'If you have an address, write it starting with the city. We\'ll show it in the profile.',
      slotDuration: 'By default, a slot is one hour, but you can narrow it down to half an hour. If services are longer than an hour - no problem, the system will account for it.'
    },
    placeholder: {
      picture: 'Choose image',
      name: 'Write here...',
      description: 'Write here...',
      specialization: 'Write here...',
      address: 'Write here...',
      country: 'Select country...',
      category: 'Select field...',
      mapLink: 'Paste here...'
    },
    error: {
      name: 'Name or title is required',
      description: 'Description is also needed',
      category: 'Field of activity is also required',
      country: 'Select country of service provision',
      mapLink: 'Link must start with https://'
    }
  },
  service: {
    field: {
      name: 'Name',
      description: 'Description',
      price: 'Price',
      isOnline: 'Online service',
      isVisits: 'Home visits available',
      duration: 'Duration',
      allDay: 'Takes the whole day',
      autoConfirm: 'Auto-confirm bookings',
    },
    hint: {
      name: '',
      description: '',
      price: '',
      isOnline_y: 'Video call in Zoom or similar service.',
      isOnline_n: 'Video call in Zoom or similar service.',
      isVisits_y: 'Don\'t forget to account for travel time in slots.',
      isVisits_n: '',
      duration: '',
      allDay: 'We\'ll book available slots for the entire day.',
      autoConfirm_y: 'Bookings will be confirmed automatically.',
      autoConfirm_n: 'You\'ll confirm bookings manually.',
    },
    placeholder: {
      name: 'Write here...',
      description: 'Write here...',
      duration: 'Write here...',
      price: 'Write here...',
    },
    error: {
      name: 'Name is required',
      duration: 'Need to know how long the service takes.',
      price: 'If the service is free, leave 0, otherwise price is required.',
    },
  },
  booking: {
    field: {
      comment: 'Comment'
    },
    placeholder: {
      comment: 'Booking comment'
    }
  },
  feedback: {
    field: {
      text: 'Write a few words',
      isAnonymous: 'Anonymous',
    },
    hint: {
      text: '',
      isAnonymous: 'We won\'t tell anyone it\'s you.'
    },
    placeholder: {
      text: 'Write here...'
    }
  }
}
