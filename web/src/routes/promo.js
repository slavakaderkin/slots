import { lazy } from 'react';
const Promo = lazy(() => import('@pages/Promo'));

export default {
  path: 'promo',
  Component: Promo
};
