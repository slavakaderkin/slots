import { lazy } from 'react';
const Clients = lazy(() => import('@pages/Clients'));
const Client = lazy(() => import('@pages/Client'));

export default {
  path: 'clients',
  children: [
    { index: true,  Component: Clients },
    { path: ':clientId', Component: Client }
  ]

};
