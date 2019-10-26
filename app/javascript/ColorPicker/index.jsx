import React, { Suspense } from 'react';

import LoadingIndicator from '../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../checkBundleHash';

const SyncColorPicker = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "color-picker" */ './SyncColorPicker'));

function ColorPicker(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncColorPicker {...props} />
    </Suspense>
  );
}

export default ColorPicker;
