import { lazy } from 'react';
const Profile = lazy(() => import('@pages/Profile'));

export default {
  path: 'profile',
  children: [
    { index: true, Component: Profile },
    { path: ':profileId',  Component: Profile }
  ]
};
