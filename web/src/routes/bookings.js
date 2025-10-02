import { lazy } from 'react';
const Booking = lazy(() => import('@pages/Booking'));

export default {
  path: 'bookings/:bookingId',
  Component: Booking
};
