import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

export default function OutletWithLoading() {
  return (
    <Suspense fallback={<PageLoadingIndicator visible />}>
      <Outlet />
    </Suspense>
  );
}
