import { useParams, Outlet, Route, Routes } from 'react-router-dom';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useUserAdminQuery } from './queries.generated';
import { useTranslation } from 'react-i18next';

function UserBreadcrumbItem() {
  const { id } = useParams<{ id: string }>();
  if (id == null) {
    throw new Error('User ID not found in params');
  }
  const { data, loading, error } = useUserAdminQuery({ variables: { id } });

  if (loading) {
    return (
      <BreadcrumbItem active to={''}>
        <LoadingIndicator iconSet="bootstrap-icons" />
      </BreadcrumbItem>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <BreadcrumbItem active to={''}>
      {data.user.name}
    </BreadcrumbItem>
  );
}

function UsersAdmin(): JSX.Element {
  const { t } = useTranslation();
  const authorizationWarning = useAuthorizationRequired('can_read_users');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to="" end>
          {t('navigation.admin.users')}
        </RouteActivatedBreadcrumbItem>

        <Routes>
          <Route path=":id" element={<UserBreadcrumbItem />} />
        </Routes>
      </ol>

      <Outlet />
    </>
  );
}

export default UsersAdmin;
