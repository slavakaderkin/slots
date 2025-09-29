import { lazy } from 'react';
const Profile = lazy(() => import('@pages/Profile'));

export default {
  path: 'preview',
  children: [
    { index: true, Component: Profile },
    { path: ':profileId', Component: Profile }
  ]
};
