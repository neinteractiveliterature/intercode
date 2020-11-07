import { Suspense } from 'react';

import LoadingIndicator from '../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../checkBundleHash';
import type { SyncColorPickerProps } from './SyncColorPicker';

const SyncColorPicker = lazyWithBundleHashCheck(() =>
  import(/* webpackChunkName: "color-picker" */ './SyncColorPicker'),
);

function ColorPicker(props: SyncColorPickerProps) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncColorPicker {...props} />
    </Suspense>
  );
}

export default ColorPicker;
