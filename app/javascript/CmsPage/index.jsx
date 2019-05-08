import React, { lazy, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { CmsPageQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import useQuerySuspended from '../useQuerySuspended';
import parsePageContent from './parsePageContent';

const PageAdminDropdown = lazy(() => import(/* webpackChunkName: "page-admin-dropdown" */ './PageAdminDropdown'));

function CmsPage({ slug, rootPage }) {
  const { data, error } = useQuerySuspended(CmsPageQuery, { variables: { slug, rootPage } });
  const content = useMemo(
    () => {
      if (error) {
        return null;
      }

      return parsePageContent(data.cmsPage.content_html);
    },
    [data, error],
  );

  useEffect(() => {
    // reinitialize Bootstrap Native whenever content changes
    window.BSN.initCallback();
  }, [content]);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      {data.cmsPage.current_ability_can_update && (
        <div className="page-admin-dropdown">
          <PageAdminDropdown
            pageId={data.cmsPage.id}
            showDelete={data.cmsPage.current_ability_can_delete}
          />
        </div>
      )}
      {content}
    </>
  );
}

CmsPage.propTypes = {
  slug: PropTypes.string,
  rootPage: PropTypes.bool,
};

CmsPage.defaultProps = {
  slug: null,
  rootPage: false,
};

function CmsPageRouter() {
  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route
          path="/pages/:slug([a-zA-Z0-9\-/]+)"
          render={routeProps => (
            <CmsPage {...routeProps} slug={routeProps.match.params.slug} />
          )}
        />
        <Route
          path="/"
          exact
          render={routeProps => (
            <CmsPage {...routeProps} rootPage />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default CmsPageRouter;
