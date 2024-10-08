import React, { useEffect, useMemo, useState } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router';
import parseCmsContent, { CMS_COMPONENT_MAP } from './parseCmsContent';
import OutletWithLoading from './OutletWithLoading';
import NavigationBar from './NavigationBar';
import { ScriptTag } from './parsePageContent';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { Helmet } from 'react-helmet-async';
import { client } from './useIntercodeApolloClient';
import { AppRootLayoutQueryData, AppRootLayoutQueryDocument } from './appRootQueries.generated';

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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { data } = await client.query({
    query: AppRootLayoutQueryDocument,
    variables: { path: normalizePathForLayout(url.pathname) },
  });
  return data;
};

function AppRootLayout() {
  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<string>();
  const [layoutChanged, setLayoutChanged] = useState(false);
  const data = useLoaderData() as AppRootLayoutQueryData;

  const parsedCmsContent = useMemo(() => {
    return parseCmsContent(data.cmsParentByRequestHost.effectiveCmsLayout.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRouter: OutletWithLoading,
      NavigationBar,
    });
  }, [data.cmsParentByRequestHost.effectiveCmsLayout.content_html]);

  const [headComponentsWithoutScriptTags, headScriptTags] = useMemo(() => {
    if (parsedCmsContent?.headComponents == null) {
      return [[], []];
    }

    const nonScriptTags: React.ReactNode[] = [];
    const scriptTags: React.ReactNode[] = [];

    React.Children.forEach(parsedCmsContent.headComponents, (child) => {
      if (React.isValidElement(child) && child.type === ScriptTag) {
        scriptTags.push(child);
      } else {
        nonScriptTags.push(child);
      }
    });

    return [nonScriptTags, scriptTags];
  }, [parsedCmsContent?.headComponents]);

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
      <Helmet>{headComponentsWithoutScriptTags}</Helmet>
      {headScriptTags}
      {parsedCmsContent?.bodyComponents}
    </>
  );
}

export const Component = AppRootLayout;
