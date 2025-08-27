import { Outlet } from 'react-router';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { Suspense } from 'react';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function FormAdmin(): React.JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_forms');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <NamedRouteBreadcrumbItem routeId={['AdminForms', 'FormAdminIndex']}>Forms</NamedRouteBreadcrumbItem>
          <NamedRouteBreadcrumbItem routeId="FormJSONEditor">Edit form (advanced)</NamedRouteBreadcrumbItem>
        </ol>
      </nav>

      <Suspense fallback={<PageLoadingIndicator visible />}>
        <Outlet />
      </Suspense>
    </>
  );
}

export const Component = FormAdmin;
