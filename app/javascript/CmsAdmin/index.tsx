import { Outlet, useRouteLoaderData } from 'react-router';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { Suspense } from 'react';
import { BootstrapRRNavLink } from '../UIComponents/BootstrapNavLink';
import { NamedRoute } from 'routes';
import { Route, Info } from './+types/index';
import { CmsAdminBaseQueryDocument } from './queries.generated';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsAdminBaseQueryDocument });
  return data;
}

export function useCmsAdminBaseQueryLoader() {
  return useRouteLoaderData(NamedRoute.CmsAdmin) as Info['loaderData'];
}

function CmsAdmin({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_any_cms_content');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1>CMS</h1>

      <ul className="nav nav-tabs" role="tablist">
        <BootstrapRRNavLink to="/cms_pages" icon="bi-file-earmark-text">
          Pages
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="/cms_partials" icon="bi-paperclip">
          Partials
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="/cms_files" icon="bi-file-earmark-image">
          Files
        </BootstrapRRNavLink>
        {data?.currentAbility.can_create_cms_navigation_items && (
          <BootstrapRRNavLink to="/cms_navigation_items" icon="bi-map">
            Navigation
          </BootstrapRRNavLink>
        )}
        <BootstrapRRNavLink to="/cms_layouts" icon="bi-layout-split">
          Layouts
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="/cms_variables" icon="bi-list-ul">
          Variables
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="/cms_graphql_queries" icon="bi-code-slash">
          GraphQL queries
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="/cms_content_groups" icon="bi-people-fill">
          Content groups
        </BootstrapRRNavLink>
        {data && !data.convention && (
          <BootstrapRRNavLink to="/root_site" icon="bi-gear-wide-connected">
            Root site settings
          </BootstrapRRNavLink>
        )}
      </ul>

      <br />

      <Suspense fallback={<PageLoadingIndicator visible />}>
        <Outlet />
      </Suspense>
    </>
  );
}

export default CmsAdmin;
