import { ReactNode } from 'react';
import { ComponentMap, ContentParserContext, DEFAULT_COMPONENT_MAP, parseDocument } from './parsePageContent';
import AppShellContent from './AppShellContent';

export function parseContent(content: string, componentMap: ComponentMap = DEFAULT_COMPONENT_MAP) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  return parseDocument(doc, componentMap, Node, window);
}

export type BrowserContentParserProviderProps = {
  children: ReactNode;
};

export function BrowserContentParserProvider({ children }: BrowserContentParserProviderProps) {
  return <ContentParserContext.Provider value={parseContent}>{children}</ContentParserContext.Provider>;
}

type BrowserAppShellProps = {
  appRootContent: string;
};

export default function BrowserAppShell({ appRootContent }: BrowserAppShellProps) {
  return (
    <BrowserContentParserProvider>
      <AppShellContent appRootContent={appRootContent} />
    </BrowserContentParserProvider>
  );
}
