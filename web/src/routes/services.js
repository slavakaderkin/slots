import { lazy } from 'react';
const EditableService = lazy(() => import('@pages/EditableService'));
const Services = lazy(() => import('@pages/Services'));

export default {
  path: 'services', children: [
    { index: true, Component: Services },
    { path: 'add', Component: EditableService },
    { path: 'edit/:serviceId', Component: EditableService }
  ] 
};
