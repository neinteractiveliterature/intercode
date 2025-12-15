import { useEffect, useMemo, useState } from 'react';
import parseCmsContent, { CMS_COMPONENT_MAP } from './parseCmsContent';
import OutletWithLoading from './OutletWithLoading';
import NavigationBar from './NavigationBar';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { AppRootLayoutQueryDocument } from './appRootQueries.generated';
import { apolloClientContext } from '~/AppContexts';
import { Route } from './+types/AppRootLayout';

// Avoid unnecessary layout checks when moving between pages that can't change layout
function normalizePathForLayout(path: string) {
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

export async function clientLoader({ context, request }: Route.ClientLoaderArgs) {
  const client = context.get(apolloClientContext);
  const url = new URL(request.url);
  const { data, error } = await client.query({
    query: AppRootLayoutQueryDocument,
    variables: { path: normalizePathForLayout(url.pathname) },
  });
  if (!data) {
    throw error;
  }
  return data;
}

function AppRootLayout({ loaderData: data }: Route.ComponentProps) {
  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<string>();
  const [layoutChanged, setLayoutChanged] = useState(false);

  const parsedCmsContent = useMemo(() => {
    return parseCmsContent(data.cmsParentByRequestHost.effectiveCmsLayout.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
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

  if (!parsedCmsContent?.bodyComponents) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  return (
    <>
      {parsedCmsContent.headComponents}
      {parsedCmsContent.bodyComponents}
    </>
  );
}

export const Component = AppRootLayout;
