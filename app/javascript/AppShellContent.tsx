import { useMemo } from 'react';
import { useParseContent } from './parsePageContent';

type AppShellContentProps = {
  appRootContent: string;
};

function AppShellContent({ appRootContent }: AppShellContentProps) {
  const parseContent = useParseContent();
  const content = useMemo(() => parseContent(appRootContent), [appRootContent, parseContent]);
  const dataIntercodeSSRHydrate = useMemo(() => JSON.stringify({ appRootContent }), [appRootContent]);

  return (
    <html lang="en">
      <head>{content.headComponents}</head>
      <body data-intercode-ssr-hydrate={dataIntercodeSSRHydrate}>{content.bodyComponents}</body>
    </html>
  );
}

export default AppShellContent;
