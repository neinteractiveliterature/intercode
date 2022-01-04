import { Suspense } from 'react';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import { lazyWithAppEntrypointHeadersCheck } from '../checkAppEntrypointHeadersMatch';
import type { SyncColorPickerProps } from './SyncColorPicker';

const SyncColorPicker = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "color-picker" */ './SyncColorPicker'),
);

function ColorPicker(props: SyncColorPickerProps): JSX.Element {
  return (
    <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
      <SyncColorPicker {...props} />
    </Suspense>
  );
}

export default ColorPicker;
