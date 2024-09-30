import { useEffect, useMemo, useState } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router';
import { CMS_COMPONENT_MAP, parseCmsContent } from './parseCmsContent';
import OutletWithLoading from './OutletWithLoading';
import NavigationBar from './NavigationBar';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { buildServerApolloClient } from './useIntercodeApolloClient';
import { AppRootContentQueryData, AppRootContentQueryDocument } from './appRootQueries.generated';
import RouteErrorBoundary from 'RouteErrorBoundary';

// Avoid unnecessary layout checks when moving between pages that can't change layout
export function normalizePathForLayout(path: string) {
  if (path.startsWith('/pages/') || path === '/') {
    return path;
  }

  // only event ID is relevant for layout rendering
  const eventsMatch = path.match(/^\/events\/(\d+)/);
  if (eventsMatch) {
    // eslint-disable-next-line i18next/no-literal-string
    return `/events/${eventsMatch[1]}`;
  }

  // eslint-disable-next-line i18next/no-literal-string
  return '/non_cms_path'; // arbitrary path that's not a CMS page
}

export const loader: LoaderFunction = async ({ request }) => {
  const client = buildServerApolloClient(request);
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootContentQueryDocument,
    variables: { domain: url.hostname, path: normalizePathForLayout(url.pathname) },
  });
  return data;
};

export const errorElement = RouteErrorBoundary;

function AppRootLayout() {
  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<string>();
  const [layoutChanged, setLayoutChanged] = useState(false);
  const data = useLoaderData() as AppRootContentQueryData;

  console.log(data);

  const parsedCmsContent = useMemo(() => {
    return parseCmsContent(data.cmsParentByDomain.effectiveCmsLayout.app_root_content ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRoot: OutletWithLoading,
      NavigationBar,
    });
  }, [data.cmsParentByDomain.effectiveCmsLayout.app_root_content]);

  useEffect(() => {
    if (cachedCmsLayoutId !== data.cmsParentByDomain.effectiveCmsLayout.id) {
      if (cachedCmsLayoutId) {
        // if the layout changed we need a full page reload to rerender the <head>
        setLayoutChanged(true);
        window.location.reload();
      } else {
        setCachedCmsLayoutId(data.cmsParentByDomain.effectiveCmsLayout.id);
      }
    }
  }, [cachedCmsLayoutId, data]);

  if (layoutChanged) {
    return <></>;
  }

  if (!parsedCmsContent?.bodyComponents) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  return <>{parsedCmsContent?.bodyComponents}</>;
}

export default AppRootLayout;
