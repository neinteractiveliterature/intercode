import { Outlet } from 'react-router-dom';
import { LoadQueryWrapper, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useCmsAdminBaseQuery } from './queries.generated';
import { Suspense } from 'react';
import { RouteActivatedBootstrapNavLink } from '../UIComponents/BootstrapNavLink';

export default LoadQueryWrapper(useCmsAdminBaseQuery, function CmsAdmin({ data }): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_any_cms_content');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1>CMS</h1>

      <ul className="nav nav-tabs" role="tablist">
        <RouteActivatedBootstrapNavLink path="/cms_pages" icon="bi-file-earmark-text">
          Pages
        </RouteActivatedBootstrapNavLink>
        <RouteActivatedBootstrapNavLink path="/cms_partials" icon="bi-paperclip">
          Partials
        </RouteActivatedBootstrapNavLink>
        <RouteActivatedBootstrapNavLink path="/cms_files" icon="bi-file-earmark-image">
          Files
        </RouteActivatedBootstrapNavLink>
        {data?.currentAbility.can_create_cms_navigation_items && (
          <RouteActivatedBootstrapNavLink path="/cms_navigation_items" icon="bi-map">
            Navigation
          </RouteActivatedBootstrapNavLink>
        )}
        <RouteActivatedBootstrapNavLink path="/cms_layouts" icon="bi-layout-split">
          Layouts
        </RouteActivatedBootstrapNavLink>
        <RouteActivatedBootstrapNavLink path="/cms_variables" icon="bi-list-ul">
          Variables
        </RouteActivatedBootstrapNavLink>
        <RouteActivatedBootstrapNavLink path="/cms_graphql_queries" icon="bi-code-slash">
          GraphQL queries
        </RouteActivatedBootstrapNavLink>
        <RouteActivatedBootstrapNavLink path="/cms_content_groups" icon="bi-people-fill">
          Content groups
        </RouteActivatedBootstrapNavLink>
        {data && !data.convention && (
          <RouteActivatedBootstrapNavLink path="/root_site" icon="bi-gear-wide-connected">
            Root site settings
          </RouteActivatedBootstrapNavLink>
        )}
      </ul>

      <br />

      <Suspense fallback={<PageLoadingIndicator visible />}>
        <Outlet />
      </Suspense>
    </>
  );
});
