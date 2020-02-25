import React, {
  useMemo, useEffect, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useLocation } from 'react-router-dom';

import { CmsPageQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';
import useValueUnless from '../useValueUnless';
import usePageTitle from '../usePageTitle';
import { lazyWithBundleHashCheck } from '../checkBundleHash';
import FourOhFourPage from '../FourOhFourPage';
import parseCmsContent from '../parseCmsContent';

const PageAdminDropdown = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "page-admin-dropdown" */ './PageAdminDropdown'));

function CmsPage({ slug, rootPage }) {
  const history = useHistory();
  const location = useLocation();
  const { data, loading, error } = useQuery(CmsPageQuery, { variables: { slug, rootPage } });
  const content = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return parseCmsContent(data.cmsPage.content_html).bodyComponents;
    },
    [data, loading, error],
  );

  useEffect(() => {
    // reinitialize Bootstrap Native whenever content changes
    window.BSN.initCallback();
  }, [content]);

  useEffect(() => {
    const { hash } = window.location;
    if (hash && hash.startsWith('#')) {
      const id = hash.substr(1);
      const element = document.getElementById(id) || (document.getElementsByName(id) || [])[0];
      if (element) {
        element.scrollIntoView();
      }
    }
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
    useValueUnless(() => (location.pathname === '/' ? '' : data.cmsPage.name), error || loading),
  );

  if (error) {
    if (error.message.match(/Couldn't find Page/i)) {
      return <FourOhFourPage />;
    }

    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <PageLoadingIndicator visible={loading} />
      {!loading && (
        <>
          {
            data.currentAbility.can_manage_any_cms_content && (
              <div className="page-admin-dropdown">
                <Suspense fallback={<></>}>
                  <PageAdminDropdown
                    history={history}
                    pageId={data.cmsPage.id}
                    showEdit={data.cmsPage.current_ability_can_update}
                    showDelete={data.cmsPage.current_ability_can_delete}
                  />
                </Suspense>
              </div>
            )
          }
          <div className="cms-page">
            {content}
          </div>
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

export default CmsPage;
