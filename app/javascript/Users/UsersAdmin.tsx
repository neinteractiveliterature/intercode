import { Outlet, useRouteLoaderData } from 'react-router';

import { useTranslation } from 'react-i18next';
import { NamedRoute } from '../NamedRoute';
import type { clientLoader } from './UserAdminDisplay';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function UsersAdmin(): React.JSX.Element {
  const { t } = useTranslation();
  // Undefined on the users table, where the child UserAdminDisplay route isn't matched
  const singleUserData = useRouteLoaderData<typeof clientLoader>(NamedRoute.UserAdminDisplay);

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

export default UsersAdmin;
