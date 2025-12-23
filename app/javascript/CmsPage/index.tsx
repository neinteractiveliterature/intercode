import { useMemo, useEffect, Suspense, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';

import usePageTitle from '../usePageTitle';
import { lazyWithAppEntrypointHeadersCheck } from '../checkAppEntrypointHeadersMatch';
import parseCmsContent from '../parseCmsContent';
import { CmsPageQueryDocument, CmsPageQueryVariables } from './queries.generated';
import { apolloClientContext } from '~/AppContexts';
import pageAdminDropdownStyles from '~/styles/page_admin_dropdown.module.scss';
import { Route } from './+types';

const PageAdminDropdown = lazyWithAppEntrypointHeadersCheck(() => import('./PageAdminDropdown'));

export type CmsPageProps = {
  slug?: string;
  rootPage?: boolean;
};

export const clientLoader = async ({ context, request }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const slug = new URL(request.url).pathname.replace(/^\/pages\//, '').replace(/\/$/, '');
  let variables: CmsPageQueryVariables;
  if (slug.trim().length > 0) {
    variables = { slug };
  } else {
    variables = { rootPage: true };
  }
  const { data, error } = await client.query({ query: CmsPageQueryDocument, variables });
  if (!data) {
    throw error;
  }
  return data;
};

export default function CmsPage({ loaderData: data }: Route.ComponentProps): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const lastHash = useRef('');
  const content = useMemo(
    () => parseCmsContent(data.cmsParent.cmsPage.content_html).bodyComponents,
    [data.cmsParent.cmsPage.content_html],
  );

  // from https://dev.to/mindactuate/scroll-to-anchor-element-with-react-router-v6-38op
  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document.getElementById(lastHash.current)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastHash.current = '';
      }, 100);
    }
  }, [location]);

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
        <div className={`page-admin-dropdown ${pageAdminDropdownStyles.pageAdminDropdown}`}>
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
}
