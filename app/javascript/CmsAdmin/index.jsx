import React from 'react';
import PropTypes from 'prop-types';
import {
  NavLink, Switch, Route, Redirect,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import CmsVariablesAdmin from './CmsVariablesAdmin';
import CmsGraphqlQueriesAdmin from './CmsGraphqlQueriesAdmin';
import { CmsAdminBaseQuery } from './queries.gql';
import NavigationItemsAdmin from './NavigationItemsAdmin';
import ErrorDisplay from '../ErrorDisplay';
import CmsContentGroupsAdmin from './CmsContentGroupsAdmin';
import CmsPagesAdmin from './CmsPagesAdmin';
import CmsLayoutsAdmin from './CmsLayoutsAdmin';
import CmsPartialsAdmin from './CmsPartialsAdmin';
import CmsFilesAdmin from './CmsFilesAdmin';
import RootSiteAdmin from '../RootSiteAdmin';
import LoadingIndicator from '../LoadingIndicator';

function CmsAdminNavTab({ path, children }) {
  return (
    <li className="nav-item">
      <NavLink to={path} className="nav-link" role="presentation">{children}</NavLink>
    </li>
  );
}

CmsAdminNavTab.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function CmsAdmin() {
  const { data, loading, error } = useQuery(CmsAdminBaseQuery);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1>CMS</h1>

      <ul className="nav nav-tabs" role="tablist">
        <CmsAdminNavTab path="/cms_pages">Pages</CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_partials">Partials</CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_files">Files</CmsAdminNavTab>
        {data.currentAbility.can_create_cms_navigation_items
          && <CmsAdminNavTab path="/cms_navigation_items">Navigation</CmsAdminNavTab>}
        <CmsAdminNavTab path="/cms_layouts">Layouts</CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_variables">Variables</CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_graphql_queries">GraphQL queries</CmsAdminNavTab>
        <CmsAdminNavTab path="/cms_content_groups">Content groups</CmsAdminNavTab>
        {
          !data.convention && (
            <CmsAdminNavTab path="/root_site">Root site settings</CmsAdminNavTab>
          )
        }
      </ul>

      <br />

      <Switch>
        <Route path="/cms_pages" component={CmsPagesAdmin} />
        <Route path="/cms_partials" component={CmsPartialsAdmin} />
        <Route path="/cms_files" component={CmsFilesAdmin} />
        {data.currentAbility.can_create_cms_navigation_items
          ? <Route path="/cms_navigation_items" component={NavigationItemsAdmin} />
          : <Route path="/cms_navigation_items" render={() => <Redirect to="/cms_pages" />} />}
        <Route path="/cms_layouts" component={CmsLayoutsAdmin} />
        <Route path="/cms_variables" component={CmsVariablesAdmin} />
        <Route path="/cms_graphql_queries" component={CmsGraphqlQueriesAdmin} />
        <Route path="/cms_content_groups" component={CmsContentGroupsAdmin} />
        <Route path="/root_site" component={RootSiteAdmin} />
      </Switch>
    </>
  );
}

export default CmsAdmin;
