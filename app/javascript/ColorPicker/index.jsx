import React, { lazy, Suspense } from 'react';

import LoadingIndicator from '../LoadingIndicator';

const SyncColorPicker = lazy(() => import(/* webpackChunkName: "color-picker" */ './SyncColorPicker'));

function ColorPicker(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncColorPicker {...props} />
    </Suspense>
  );
}

export default ColorPicker;
