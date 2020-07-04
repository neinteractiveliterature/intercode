import React, { Suspense } from 'react';

import LoadingIndicator from '../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../checkBundleHash';
import { SyncCodeInputProps } from './SyncCodeInput';

const SyncCodeInput = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "code-input" */ './SyncCodeInput'));

function CodeInput(props: SyncCodeInputProps) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncCodeInput {...props} />
    </Suspense>
  );
}

export default CodeInput;
