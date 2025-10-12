export default {
  alert: {
    booking: {
      success_pending: 'Sent the booking, need to wait for confirmation.',
      success_auto: 'All OK, you have successfully booked the service.',
      success_self: 'Done! You have successfully booked a client',
      failed: ':( Failed to send the booking.'
    },
    payment: {
      status_paid: 'Done! We have received the payment.',
      status_failed: ':( Failed to process the payment.',
      status_cancelled: ':( Payment cancelled.'
    },
    trial: {
      status_success: 'You have 14 days, enjoy to the fullest.',
      status_failed: ':( Failed, please contact support.',
    },
    profile: {
      save: {
        success_toservices: 'Great! Now you have a profile. Just need to add services.',
        success_toprofile: 'Done! We changed the profile, here\'s how it looks now.',
        failed: ':( Failed to save the profile.',
      },
      sended: 'Sent the profile to the chat, you can pin it in the channel or send it.',
      copied: 'Profile link copied to clipboard.',
    },
    service: {
      save: {
        success: 'Done! We saved the service.',
        failed: ':( Failed to save the service.',
      }
    },
    feedback: {
      save: {
        success: 'Done! We sent the feedback.',
        failed: ':( Failed to send the feedback.',
      }
    },
    subscription: {
      cancelled: 'Subscription renewal cancelled'
    },
    meetLink_saved: 'Done! We saved the link.',
    meetLink_copied: 'Link copied to clipboard.',
  },
  confirm: {
    profile_map: 'Open the map link?',
    booking_confirm: 'Confirm the booking?',
    booking_cancel: 'Cancel the booking?',
    service_remove: 'Are you sure you want to delete?',
    subscription_cancel: 'Cancel the subscription?'
  }
}