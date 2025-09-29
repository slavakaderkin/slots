import { lazy } from 'react';
const Booking = lazy(() => import('@pages/Booking'));
const Bookings = lazy(() => import('@pages/Bookings'));

export default {
  path: 'bookings',
  children: [
    { index: true, Component: Bookings },
    { path: ':bookingId', Component: Booking }
  ]
};
