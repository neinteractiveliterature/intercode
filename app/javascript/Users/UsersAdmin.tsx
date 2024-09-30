import { Outlet, useRouteLoaderData } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { NamedRoute } from '../appRoutes';
import { UserAdminQueryData } from './queries.generated';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function UsersAdmin(): JSX.Element {
  const { t } = useTranslation();
  const singleUserData = useRouteLoaderData(NamedRoute.UserAdminDisplay) as UserAdminQueryData;

  return (
    <>
      <ol className="breadcrumb">
        <NamedRouteBreadcrumbItem routeId={['UserAdmin', 'UsersTable']}>
          {t('navigation.admin.users')}
        </NamedRouteBreadcrumbItem>

        {singleUserData && (
          <NamedRouteBreadcrumbItem routeId="UserAdminDisplay">{singleUserData.user.name}</NamedRouteBreadcrumbItem>
        )}
      </ol>

      <Outlet />
    </>
  );
}

export const Component = UsersAdmin;
