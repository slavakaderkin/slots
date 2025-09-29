import { lazy } from 'react';
const Workspace = lazy(() => import('@pages/Workspace'));

export default {
  path: 'workspace',
  Component: Workspace
};
