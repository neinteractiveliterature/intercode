import { useEffect, useMemo, useRef } from 'react';
import { LoaderFunction, RouterContextProvider, useLoaderData } from 'react-router';
import parseCmsContent, { CMS_COMPONENT_MAP } from './parseCmsContent';
import OutletWithLoading from './OutletWithLoading';
import NavigationBar from './NavigationBar';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { AppRootLayoutQueryData, AppRootLayoutQueryDocument } from './appRootQueries.generated';
import { apolloClientContext } from 'AppContexts';
import { normalizePathForLayout } from './normalizePathForLayout';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootLayoutQueryDocument,
    variables: { path: normalizePathForLayout(url.pathname) },
  });
  return data;
};

function AppRootLayout() {
  const cachedCmsLayoutId = useRef<string>(undefined);
  const data = useLoaderData() as AppRootLayoutQueryData;

  const parsedCmsContent = useMemo(() => {
    return parseCmsContent(data.cmsParentByRequestHost.effectiveCmsLayout.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRouter: OutletWithLoading,
      NavigationBar,
    });
  }, [data.cmsParentByRequestHost.effectiveCmsLayout.content_html]);

  useEffect(() => {
    const currentId = data.cmsParentByRequestHost.effectiveCmsLayout.id;
    if (cachedCmsLayoutId.current && cachedCmsLayoutId.current !== currentId) {
      // if the layout changed we need a full page reload to rerender the <head>
      window.location.reload();
    } else {
      cachedCmsLayoutId.current = currentId;
    }
  }, [cachedCmsLayoutId, data]);

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
