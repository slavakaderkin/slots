export default {
  alert: {
    booking: {
      success_pending: 'Booking sent, waiting for confirmation.',
      success_auto: 'All OK, you have successfully booked the service.',
      success_self: 'Done! You have successfully booked a client',
      failed: ':( Failed to send booking.',
      haveActiveToday: 'You already have a booking for today.',
      youAreBanned: 'This professional has blocked you',
    },
    payment: {
      status_paid: 'Done! We received your payment.',
      status_failed: ':( Unable to process payment.',
      status_cancelled: ':( Payment cancelled.'
    },
    client: {
      blocked: 'Client blocked',
      unblocked: 'Client unblocked',
    },
    trial: {
      status_success: 'You have 14 days, enjoy to the fullest.',
      status_failed: ':( Failed, please contact support.',
    },
    profile: {
      save: {
        success_toservices: 'Great! Now you have a profile. Just need to add services.',
        success_toprofile: 'Done! We updated your profile, here\'s how it looks now.',
        failed: ':( Failed to save profile.',
      },
      sended: 'Profile sent to chat, you can pin it in channel or forward.',
      copied: 'Profile link copied to clipboard.',
    },
    service: {
      save: {
        success: 'Done! We saved the service.',
        failed: ':( Failed to save service.',
      }
    },
    feedback: {
      save: {
        success: 'Done! We sent your review.',
        failed: ':( Failed to send review.',
      }
    },
    subscription: {
      cancelled: 'Subscription renewal cancelled'
    },
    meetLink_saved: 'Done! We saved the link.',
    meetLink_copied: 'Link copied to clipboard.',
  },
  confirm: {
    profile_map: 'Open map link?',
    booking_confirm: 'Confirm booking?',
    booking_cancel: 'Cancel booking?',
    service_remove: 'Are you sure you want to delete?',
    subscription_cancel: 'Cancel subscription?',
    client_block: 'Block client?',
  }
}