import { ReactNode } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import CmsVariablesAdmin from './CmsVariablesAdmin';
import CmsGraphqlQueriesAdmin from './CmsGraphqlQueriesAdmin';
import NavigationItemsAdmin from './NavigationItemsAdmin';
import CmsContentGroupsAdmin from './CmsContentGroupsAdmin';
import CmsPagesAdmin from './CmsPagesAdmin';
import CmsLayoutsAdmin from './CmsLayoutsAdmin';
import CmsPartialsAdmin from './CmsPartialsAdmin';
import CmsFilesAdmin from './CmsFilesAdmin';
import RootSiteAdmin from '../RootSiteAdmin';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import MenuIcon from '../NavigationBar/MenuIcon';
import { useCmsAdminBaseQuery } from './queries.generated';

type CmsAdminNavTabProps = {
  path: string;
  children: ReactNode;
  icon?: string;
};

function CmsAdminNavTab({ path, children, icon }: CmsAdminNavTabProps) {
  return (
    <li className="nav-item">
      <NavLink to={path} className="nav-link" role="presentation">
        {icon && <MenuIcon icon={icon} />}
        {children}
      </NavLink>
    </li>
  );
}

export default LoadQueryWrapper(useCmsAdminBaseQuery, function CmsAdmin({ data }): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_any_cms_content');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1>CMS</h1>

      <ul className="nav nav-tabs" role="tablist">
        <CmsAdminNavTab path="/cms_pages" icon="bi-file-earmark-text">
          Pages
        </CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_partials" icon="bi-paperclip">
          Partials
        </CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_files" icon="bi-file-earmark-image">
          Files
        </CmsAdminNavTab>
        {data?.currentAbility.can_create_cms_navigation_items && (
          <CmsAdminNavTab path="/cms_navigation_items" icon="bi-map">
            Navigation
          </CmsAdminNavTab>
        )}
        <CmsAdminNavTab path="/cms_layouts" icon="bi-layout-split">
          Layouts
        </CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_variables" icon="bi-list-ul">
          Variables
        </CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_graphql_queries" icon="bi-code-slash">
          GraphQL queries
        </CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_content_groups" icon="bi-people-fill">
          Content groups
        </CmsAdminNavTab>
        {data && !data.convention && (
          <CmsAdminNavTab path="/root_site" icon="bi-gear-wide-connected">
            Root site settings
          </CmsAdminNavTab>
        )}
      </ul>

      <br />

      <Routes>
        <Route path="/cms_pages" element={<CmsPagesAdmin />} />
        <Route path="/cms_partials" element={<CmsPartialsAdmin />} />
        <Route path="/cms_files" element={<CmsFilesAdmin />} />
        {data?.currentAbility.can_create_cms_navigation_items ? (
          <Route path="/cms_navigation_items" element={<NavigationItemsAdmin />} />
        ) : (
          <Route path="/cms_navigation_items" element={<Navigate to="/cms_pages" />} />
        )}
        <Route path="/cms_layouts" element={<CmsLayoutsAdmin />} />
        <Route path="/cms_variables" element={<CmsVariablesAdmin />} />
        <Route path="/cms_graphql_queries" element={<CmsGraphqlQueriesAdmin />} />
        <Route path="/cms_content_groups" element={<CmsContentGroupsAdmin />} />
        {data && !data.convention && <Route path="/root_site" element={<RootSiteAdmin />} />}
      </Routes>
    </>
  );
});
