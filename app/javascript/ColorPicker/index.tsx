import { Suspense, lazy } from 'react';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import type { SyncColorPickerProps } from './SyncColorPicker';

const SyncColorPicker = lazy(() => import('./SyncColorPicker'));

function ColorPicker(props: SyncColorPickerProps): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
      <SyncColorPicker {...props} />
    </Suspense>
  );
}

export default ColorPicker;
