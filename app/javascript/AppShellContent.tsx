import React, { useMemo } from 'react';
import { ScriptTag, useParseContent } from './parsePageContent';

export type AppShellContentProps = {
  appRootContent: string;
};

function AppShellContent({ appRootContent }: AppShellContentProps) {
  const parseContent = useParseContent();
  const content = useMemo(() => parseContent(appRootContent), [appRootContent, parseContent]);
  const dataIntercodeSSRHydrate = useMemo(() => JSON.stringify({ appRootContent }), [appRootContent]);

  const [headComponentsWithoutScriptTags, headScriptTags] = useMemo(() => {
    if (content?.headComponents == null) {
      return [[], []];
    }

    const nonScriptTags: React.ReactNode[] = [];
    const scriptTags: React.ReactNode[] = [];

    React.Children.forEach(content.headComponents, (child) => {
      if (React.isValidElement(child) && child.type === ScriptTag) {
        scriptTags.push(child);
      } else {
        nonScriptTags.push(child);
      }
    });

    return [nonScriptTags, scriptTags];
  }, [content?.headComponents]);

  return (
    <html lang="en">
      <head>{headComponentsWithoutScriptTags}</head>
      <body data-intercode-ssr-hydrate={dataIntercodeSSRHydrate}>
        {headScriptTags}
        {content.bodyComponents}
      </body>
    </html>
  );
}

export default AppShellContent;
