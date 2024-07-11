import { ReactNode, useMemo } from 'react';

type AppShellContentProps = {
  appRootContent: string;
  parseDocument: (html: string) => { bodyComponents: ReactNode; headComponents: ReactNode };
};

function AppShellContent({ appRootContent, parseDocument }: AppShellContentProps) {
  const content = useMemo(() => parseDocument(appRootContent), [appRootContent, parseDocument]);
  const dataIntercodeSSRHydrate = useMemo(() => JSON.stringify({ appRootContent }), [appRootContent]);

  return (
    <html lang="en">
      <head>{content.headComponents}</head>
      <body data-intercode-ssr-hydrate={dataIntercodeSSRHydrate}>{content.bodyComponents}</body>
    </html>
  );
}

export default AppShellContent;
