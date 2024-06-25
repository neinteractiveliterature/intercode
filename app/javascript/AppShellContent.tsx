import { ReactNode, useMemo } from 'react';

type AppShellContentProps = {
  appRootContent: string;
  parseDocument: (html: string) => { bodyComponents: ReactNode; headComponents: ReactNode };
};

function AppShellContent({ appRootContent, parseDocument }: AppShellContentProps) {
  const content = useMemo(() => parseDocument(appRootContent), [appRootContent, parseDocument]);
  // const styleLoaderInserts = useMemo(
  //   // eslint-disable-next-line no-underscore-dangle
  //   () => parseDocument((window._elementsInsertedByStyleLoader ?? []).map((element) => element.innerHTML).join('')),
  //   [parseDocument],
  // );
  // const dataIntercodeSSRHydrate = useMemo(() => JSON.stringify({ appRootContent }), [appRootContent]);

  return (
    <html lang="en">
      <head>
        {/* {styleLoaderInserts.headComponents} */}
        {content.headComponents}
      </head>
      <body>{content.bodyComponents}</body>
    </html>
  );
}

export default AppShellContent;
