import React, {
  lazy, useMemo, useEffect, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';

import { CmsPageQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';
import parsePageContent from '../parsePageContent';
import useValueUnless from '../useValueUnless';
import usePageTitle from '../usePageTitle';

const PageAdminDropdown = lazy(() => import(/* webpackChunkName: "page-admin-dropdown" */ './PageAdminDropdown'));

function CmsPage({
  slug, rootPage, history, location,
}) {
  const { data, loading, error } = useQuery(CmsPageQuery, { variables: { slug, rootPage } });
  const content = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return parsePageContent(data.cmsPage.content_html).bodyComponents;
    },
    [data, loading, error],
  );

  useEffect(() => {
    // reinitialize Bootstrap Native whenever content changes
    window.BSN.initCallback();
  }, [content]);

  useEffect(
    () => {
      if (
        !loading && !error
        && data.myProfile
        && ((data.convention || {}).clickwrap_agreement || '').trim() !== ''
        && !data.myProfile.accepted_clickwrap_agreement
        && !data.cmsPage.skip_clickwrap_agreement
      ) {
        history.replace('/clickwrap_agreement');
      }
    },
    [data, error, history, loading, location],
  );

  usePageTitle(
    useValueUnless(() => (location.pathname === '/' ? null : data.cmsPage.name), error || loading),
    useValueUnless(() => data.convention, error || loading),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <PageLoadingIndicator visible={loading} />
      {!loading && (
        <>
          {
            data.cmsPage.current_ability_can_update && (
              <div className="page-admin-dropdown">
                <Suspense fallback={<></>}>
                  <PageAdminDropdown
                    history={history}
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
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

CmsPage.defaultProps = {
  slug: null,
  rootPage: false,
};

export default CmsPage;
