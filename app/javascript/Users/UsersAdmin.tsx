import { useParams, Outlet } from 'react-router-dom';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useUserAdminQuerySuspenseQuery } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

function UserBreadcrumbItem({ id }: { id: string }) {
  const { data } = useUserAdminQuerySuspenseQuery({ variables: { id } });

  return (
    <BreadcrumbItem active to={''}>
      {data.user.name}
    </BreadcrumbItem>
  );
}

function UsersAdmin(): JSX.Element {
  const { id } = useParams();
  const { t } = useTranslation();
  const authorizationWarning = useAuthorizationRequired('can_read_users');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to="" end>
          {t('navigation.admin.users')}
        </RouteActivatedBreadcrumbItem>

        {id && (
          <Suspense
            fallback={
              <li className="breadcrumb-item active">
                <LoadingIndicator size={8} />
              </li>
            }
          >
            <UserBreadcrumbItem id={id} />
          </Suspense>
        )}
      </ol>

      <Outlet />
    </>
  );
}

export const Component = UsersAdmin;
