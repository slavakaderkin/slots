import { lazy } from 'react';
const Slots = lazy(() => import('@pages/Slots'));
//import Slots from '@pages/Slots';

export default {
  path: 'slots',
  Component: Slots
};
