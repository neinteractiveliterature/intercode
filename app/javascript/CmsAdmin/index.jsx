import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, NavLink, Switch, Route,
} from 'react-router-dom';

import CmsVariablesAdmin from './CmsVariablesAdmin';
import CmsGraphqlQueriesAdmin from './CmsGraphqlQueriesAdmin';
import { ConventionExistsQuery } from './queries.gql';
import NavigationItemsAdmin from './NavigationItemsAdmin';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import CmsPagesAdmin from './CmsPagesAdmin';
import CmsLayoutsAdmin from './CmsLayoutsAdmin';

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
  const { data, error } = useQuerySuspended(ConventionExistsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <BrowserRouter basename="/">
      <>
        <h1>CMS</h1>

        <ul className="nav nav-tabs" role="tablist">
          <CmsAdminNavTab path="/cms_pages">Pages</CmsAdminNavTab>
          <CmsAdminNavTab path="/cms_partials">Partials</CmsAdminNavTab>
          <CmsAdminNavTab path="/cms_files">Files</CmsAdminNavTab>
          <CmsAdminNavTab path="/cms_navigation_items">Navigation</CmsAdminNavTab>
          <CmsAdminNavTab path="/cms_layouts">Layouts</CmsAdminNavTab>
          <CmsAdminNavTab path="/cms_variables">Variables</CmsAdminNavTab>
          <CmsAdminNavTab path="/cms_graphql_queries">GraphQL queries</CmsAdminNavTab>
          {
            !data.convention && (
              <CmsAdminNavTab path="/root_site">Root site settings</CmsAdminNavTab>
            )
          }
        </ul>

        <br />

        <Switch>
          <Route path="/cms_pages" component={CmsPagesAdmin} />
          <Route path="/cms_navigation_items" component={NavigationItemsAdmin} />
          <Route path="/cms_layouts" component={CmsLayoutsAdmin} />
          <Route path="/cms_variables" component={CmsVariablesAdmin} />
          <Route path="/cms_graphql_queries" component={CmsGraphqlQueriesAdmin} />
        </Switch>
      </>
    </BrowserRouter>
  );
}

export default CmsAdmin;
