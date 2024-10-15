import { useEffect, useMemo, useState } from 'react';
import { CMS_COMPONENT_MAP, parseCmsContent } from './parseCmsContent';
import OutletWithLoading from './OutletWithLoading';
import NavigationBar from './NavigationBar';
import { AppRootLayoutQueryDocument } from './appRootQueries.generated';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { buildServerApolloClient } from 'serverApolloClient.server';
import * as Route from './+types.AppRootLayout';

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

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = buildServerApolloClient(request);
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootLayoutQueryDocument,
    variables: { path: normalizePathForLayout(url.pathname) },
  });
  return data;
};

export const errorElement = RouteErrorBoundary;

function AppRootLayout({ loaderData: data }: Route.ComponentProps) {
  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<string>();
  const [layoutChanged, setLayoutChanged] = useState(false);

  const parsedCmsContent = useMemo(() => {
    return parseCmsContent(data.cmsParentByRequestHost.effectiveCmsLayout.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRoot: OutletWithLoading,
      AppRouter: OutletWithLoading,
      NavigationBar,
    });
  }, [data.cmsParentByRequestHost.effectiveCmsLayout.content_html]);

  useEffect(() => {
    if (cachedCmsLayoutId !== data.cmsParentByRequestHost.effectiveCmsLayout.id) {
      if (cachedCmsLayoutId) {
        // if the layout changed we need a full page reload to rerender the <head>
        setLayoutChanged(true);
        window.location.reload();
      } else {
        setCachedCmsLayoutId(data.cmsParentByRequestHost.effectiveCmsLayout.id);
      }
    }
  }, [cachedCmsLayoutId, data]);

  if (layoutChanged) {
    return <></>;
  }

  return <>{parsedCmsContent.bodyComponents}</>;
}

export default AppRootLayout;
