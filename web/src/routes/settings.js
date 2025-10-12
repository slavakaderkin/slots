import { lazy } from 'react';
const EditableProfile = lazy(() => import('@pages/EditableProfile'));

export default {
  path: 'settings', Component: EditableProfile
};
