import { useMemo, useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import usePageTitle from '../usePageTitle';
import { lazyWithAppEntrypointHeadersCheck } from '../checkAppEntrypointHeadersMatch';
import parseCmsContent from '../parseCmsContent';
import { useCmsPageQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../GraphqlLoadingWrappers';

const PageAdminDropdown = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "page-admin-dropdown" */ './PageAdminDropdown'),
);

export type CmsPageProps = {
  slug?: string;
  rootPage?: boolean;
};

export default LoadQueryWithVariablesWrapper(
  useCmsPageQuery,
  ({ slug, rootPage }: CmsPageProps) => ({ slug, rootPage }),
  function CmsPage({ data }): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const content = useMemo(
      () => parseCmsContent(data.cmsParent.cmsPage.content_html).bodyComponents,
      [data.cmsParent.cmsPage.content_html],
    );

    useEffect(() => {
      if (
        data.convention?.my_profile &&
        (data.convention?.clickwrap_agreement ?? '').trim() !== '' &&
        !data.convention.my_profile.accepted_clickwrap_agreement &&
        !data.cmsParent.cmsPage.skip_clickwrap_agreement
      ) {
        navigate('/clickwrap_agreement', { replace: true });
      }
    }, [data, navigate, location]);

    usePageTitle(location.pathname === '/' ? '' : data.cmsParent?.cmsPage.name);

    return (
      <>
        {data.currentAbility.can_manage_any_cms_content && (
          <div className="page-admin-dropdown">
            <Suspense fallback={<></>}>
              <PageAdminDropdown
                pageId={data.cmsParent.cmsPage.id}
                showEdit={data.cmsParent.cmsPage.current_ability_can_update}
                showDelete={data.cmsParent.cmsPage.current_ability_can_delete}
              />
            </Suspense>
          </div>
        )}
        <div className="cms-page">{content}</div>
      </>
    );
  },
);
