import { ReactNode } from 'react';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

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

function CmsAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_manage_any_cms_content');
  const { data, loading, error } = useCmsAdminBaseQuery();

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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

      <Switch>
        <Route path="/cms_pages">
          <CmsPagesAdmin />
        </Route>
        <Route path="/cms_partials">
          <CmsPartialsAdmin />
        </Route>
        <Route path="/cms_files">
          <CmsFilesAdmin />
        </Route>
        {data?.currentAbility.can_create_cms_navigation_items ? (
          <Route path="/cms_navigation_items">
            <NavigationItemsAdmin />
          </Route>
        ) : (
          <Route path="/cms_navigation_items">
            <Redirect to="/cms_pages" />
          </Route>
        )}
        <Route path="/cms_layouts">
          <CmsLayoutsAdmin />
        </Route>
        <Route path="/cms_variables">
          <CmsVariablesAdmin />
        </Route>
        <Route path="/cms_graphql_queries">
          <CmsGraphqlQueriesAdmin />
        </Route>
        <Route path="/cms_content_groups">
          <CmsContentGroupsAdmin />
        </Route>
        {data && !data.convention && (
          <Route path="/root_site">
            <RootSiteAdmin />
          </Route>
        )}
      </Switch>
    </>
  );
}

export default CmsAdmin;
