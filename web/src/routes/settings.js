import { lazy } from 'react';
const EditableProfile = lazy(() => import('@pages/EditableProfile'));
const EditableService = lazy(() => import('@pages/EditableService'));
const Services = lazy(() => import('@pages/Services'));

export default {
  path: 'settings',
  children: [
    { index: true, Component: EditableProfile },
    { path: 'services', children: [
        { index: true, Component: Services },
        { path: 'add', Component: EditableService },
        { path: 'edit/:serviceId', Component: EditableService }
      ] 
    },
    
  ]
};
