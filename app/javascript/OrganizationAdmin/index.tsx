import { useParams, Outlet, Route, Routes } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useOrganizationAdminOrganizationsQuery } from './queries.generated';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';

const OrganizationWithIdBreadcrumbs = LoadQueryWrapper(
  useOrganizationAdminOrganizationsQuery,
  function OrganizationWithIdBreadcrumbs({ data }) {
    const { id } = useParams<{ id: string }>();

    const organization = data.organizations.find((org) => org.id.toString() === id);

    return (
      <>
        <RouteActivatedBreadcrumbItem to="" end>
          {organization?.name ?? 'Organization'}
        </RouteActivatedBreadcrumbItem>

        <RouteActivatedBreadcrumbItem to="roles/new" hideUnlessMatch>
          New organization role
        </RouteActivatedBreadcrumbItem>

        <Routes>
          <Route
            path="roles/:id/edit"
            element={<LeafBreadcrumbItem path="">Edit organization role</LeafBreadcrumbItem>}
          />
        </Routes>
      </>
    );
  },
);

function OrganizationAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_organizations');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to="" end>
          Organizations
        </RouteActivatedBreadcrumbItem>

        <Routes>
          <Route path=":id/*" element={<OrganizationWithIdBreadcrumbs />} />
        </Routes>
      </ol>

      <Outlet />
    </>
  );
}

export default OrganizationAdmin;
