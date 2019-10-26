import React, { Suspense } from 'react';

import LoadingIndicator from '../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../checkBundleHash';

const SyncCodeInput = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "code-input" */ './SyncCodeInput'));

function CodeInput(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncCodeInput {...props} />
    </Suspense>
  );
}

export default CodeInput;
