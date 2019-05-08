import React, {
  lazy, useMemo, useEffect, useState, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { CmsPageQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import parsePageContent from './parsePageContent';

const PageAdminDropdown = lazy(() => import(/* webpackChunkName: "page-admin-dropdown" */ './PageAdminDropdown'));

function CustomLoadingIndicator({ visible }) {
  return (
    <div className="text-center mt-5 custom-loading-indicator" style={{ opacity: visible ? 1.0 : 0.0 }}>
      <i className="fa fa-circle-o-notch fa-spin fa-fw" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

CustomLoadingIndicator.propTypes = {
  visible: PropTypes.bool.isRequired,
};

function CmsPage({ slug, rootPage }) {
  const { data, loading, error } = useQuery(CmsPageQuery, { variables: { slug, rootPage } });
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const content = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return parsePageContent(data.cmsPage.content_html);
    },
    [data, loading, error],
  );

  useEffect(
    () => {
      const timeoutId = setTimeout(() => setShowLoadingIndicator(true), 250);
      return () => clearTimeout(timeoutId);
    },
    [loading],
  );

  useEffect(() => {
    // reinitialize Bootstrap Native whenever content changes
    window.BSN.initCallback();
  }, [content]);

  if (loading) {
    return <CustomLoadingIndicator visible={showLoadingIndicator} />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <CustomLoadingIndicator visible={loading && showLoadingIndicator} />
      {!loading && (
        <>
          {
            data.cmsPage.current_ability_can_update && (
              <div className="page-admin-dropdown">
                <Suspense fallback={<></>}>
                  <PageAdminDropdown
                    pageId={data.cmsPage.id}
                    showDelete={data.cmsPage.current_ability_can_delete}
                  />
                </Suspense>
              </div>
            )
          }
          {content}
        </>
      )}
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
