import React, { lazy, Suspense } from 'react';

import LoadingIndicator from '../LoadingIndicator';

const SyncCodeInput = lazy(() => import(/* webpackChunkName: "code-input" */ './SyncCodeInput'));

function CodeInput(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncCodeInput {...props} />
    </Suspense>
  );
}

export default CodeInput;
