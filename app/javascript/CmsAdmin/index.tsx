import { Outlet } from 'react-router-dom';
import { LoadQueryWrapper, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useCmsAdminBaseQuery } from './queries.generated';
import { BootstrapNavLink } from '../UIComponents/BootstrapNavLink';
import { Suspense } from 'react';

export default LoadQueryWrapper(useCmsAdminBaseQuery, function CmsAdmin({ data }): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_any_cms_content');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1>CMS</h1>

      <ul className="nav nav-tabs" role="tablist">
        <BootstrapNavLink path="/cms_pages" icon="bi-file-earmark-text">
          Pages
        </BootstrapNavLink>
        <BootstrapNavLink path="/cms_partials" icon="bi-paperclip">
          Partials
        </BootstrapNavLink>
        <BootstrapNavLink path="/cms_files" icon="bi-file-earmark-image">
          Files
        </BootstrapNavLink>
        {data?.currentAbility.can_create_cms_navigation_items && (
          <BootstrapNavLink path="/cms_navigation_items" icon="bi-map">
            Navigation
          </BootstrapNavLink>
        )}
        <BootstrapNavLink path="/cms_layouts" icon="bi-layout-split">
          Layouts
        </BootstrapNavLink>
        <BootstrapNavLink path="/cms_variables" icon="bi-list-ul">
          Variables
        </BootstrapNavLink>
        <BootstrapNavLink path="/cms_graphql_queries" icon="bi-code-slash">
          GraphQL queries
        </BootstrapNavLink>
        <BootstrapNavLink path="/cms_content_groups" icon="bi-people-fill">
          Content groups
        </BootstrapNavLink>
        {data && !data.convention && (
          <BootstrapNavLink path="/root_site" icon="bi-gear-wide-connected">
            Root site settings
          </BootstrapNavLink>
        )}
      </ul>

      <br />

      <Suspense fallback={<PageLoadingIndicator visible />}>
        <Outlet />
      </Suspense>
    </>
  );
});
