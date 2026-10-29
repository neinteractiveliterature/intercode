import { Outlet } from 'react-router';

import { useTranslation } from 'react-i18next';
import { NamedRoute } from '../NamedRoute';
import useRequiredRouteLoaderData from '../useRequiredRouteLoaderData';
import type { clientLoader } from './UserAdminDisplay';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function UsersAdmin(): React.JSX.Element {
  const { t } = useTranslation();
  const singleUserData = useRequiredRouteLoaderData<typeof clientLoader>(NamedRoute.UserAdminDisplay);

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
