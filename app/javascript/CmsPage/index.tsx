import { useMemo, useEffect, Suspense } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import useValueUnless from '../useValueUnless';
import usePageTitle from '../usePageTitle';
import { lazyWithBundleHashCheck } from '../checkBundleHash';
import FourOhFourPage from '../FourOhFourPage';
import parseCmsContent from '../parseCmsContent';
import { useCmsPageQuery } from './queries.generated';

const PageAdminDropdown = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "page-admin-dropdown" */ './PageAdminDropdown'),
);

export type CmsPageProps = {
  slug?: string;
  rootPage?: boolean;
};

function CmsPage({ slug, rootPage }: CmsPageProps) {
  const history = useHistory();
  const location = useLocation();
  const { data, loading, error } = useCmsPageQuery({ variables: { slug, rootPage } });
  const content = useMemo(() => {
    if (loading || error || !data) {
      return null;
    }

    return parseCmsContent(data.cmsPage.content_html).bodyComponents;
  }, [data, loading, error]);

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data?.myProfile &&
      (data?.convention?.clickwrap_agreement ?? '').trim() !== '' &&
      !data.myProfile.accepted_clickwrap_agreement &&
      !data.cmsPage.skip_clickwrap_agreement
    ) {
      history.replace('/clickwrap_agreement');
    }
  }, [data, error, history, loading, location]);

  usePageTitle(
    useValueUnless(() => (location.pathname === '/' ? '' : data?.cmsPage.name), error || loading),
  );

  if (error) {
    if (error.message.match(/Couldn't find Page/i)) {
      return <FourOhFourPage />;
    }

    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <PageLoadingIndicator visible={loading} iconSet="bootstrap-icons" />
      {!loading && data && (
        <>
          {data.currentAbility.can_manage_any_cms_content && (
            <div className="page-admin-dropdown">
              <Suspense fallback={<></>}>
                <PageAdminDropdown
                  pageId={data.cmsPage.id}
                  showEdit={data.cmsPage.current_ability_can_update}
                  showDelete={data.cmsPage.current_ability_can_delete}
                />
              </Suspense>
            </div>
          )}
          <div className="cms-page">{content}</div>
        </>
      )}
    </>
  );
}

export default CmsPage;
