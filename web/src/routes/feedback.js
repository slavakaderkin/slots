import { lazy } from 'react';
const Feedback = lazy(() => import('@pages/Feedback'));

export default {
  path: 'feedback/:bookingId',
  Component: Feedback
};
