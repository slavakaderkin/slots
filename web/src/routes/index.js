import { lazy } from 'react';
import Page from '@components/layout/Page';
const Profile = lazy(() => import('@pages/Profile'));
const Account = lazy(() => import('@pages/Account'));

const modules = import.meta.glob('./*.js', {
  import: 'default',
  eager: true,
});

const root = [{
  path: '/',
  Component: Page,
  children: [
    { index: true, Component: Account },
    ...Object.values(modules)
  ],
}];

export default root