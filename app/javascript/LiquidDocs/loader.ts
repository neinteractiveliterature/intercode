import { LoaderFunction, useRouteLoaderData } from 'react-router';
import keyBy from 'lodash/keyBy';

import {
  LiquidAssignsQueryData,
  LiquidAssignsQueryDocument,
  LiquidAssignsQueryVariables,
  NotifierLiquidAssignsQueryData,
  NotifierLiquidAssignsQueryDocument,
  NotifierLiquidAssignsQueryVariables,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { loadDocData, YardClass, YardDocs, YardMethod } from './DocData';
import { NamedRoute } from '../AppRouter';
import findLiquidTagName from './findLiquidTagName';
import { NotificationEventKey } from 'graphqlTypes.generated';

export type LiquidDocsLoaderResultCommonFields = {
  assigns: Record<string, LiquidAssignsQueryData['cmsParent']['liquidAssigns'][number]>;
  docData: YardDocs;
  filters: Record<string, YardMethod>;
  sortedAssigns: LiquidAssignsQueryData['cmsParent']['liquidAssigns'];
  sortedFilters: YardMethod[];
  sortedTags: YardClass[];
  tags: Record<string, YardClass>;
};

export type NotifierLiquidDocsLoaderResult = LiquidDocsLoaderResultCommonFields & {
  notifierEventKey: string;
};

export type GlobalLiquidDocsLoaderResult = LiquidDocsLoaderResultCommonFields & {
  notifierEventKey: null;
};

export type LiquidDocsLoaderResult = GlobalLiquidDocsLoaderResult | NotifierLiquidDocsLoaderResult;

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

function extractCommonFields(
  data: LiquidAssignsQueryData | NotifierLiquidAssignsQueryData,
  docData: YardDocs,
): LiquidDocsLoaderResultCommonFields {
  const sortedAssigns = sortByName(data.cmsParent.liquidAssigns);
  const sortedFilters = sortByName(docData.filter_methods);
  const sortedTags = sortByName(docData.classes.filter((klass) => findLiquidTagName(klass) != null));
  const assigns = keyBy(sortedAssigns, (assign) => assign.name);
  const filters = keyBy(sortedFilters, (filter) => filter.name);
  const tags = keyBy(sortedTags, (klass) => findLiquidTagName(klass) ?? '');

  return { assigns, filters, tags, sortedAssigns, sortedFilters, sortedTags, docData };
}

export const liquidDocsLoader: LoaderFunction = async ({ request }) => {
  const notifierEventKey = new URL(request.url).searchParams.get('notifier_event_key');

  if (notifierEventKey == null) {
    const [{ data }, docData] = await Promise.all([
      client.query<LiquidAssignsQueryData, LiquidAssignsQueryVariables>({
        query: LiquidAssignsQueryDocument,
      }),
      loadDocData(),
    ]);
    return { notifierEventKey, ...extractCommonFields(data, docData) } satisfies LiquidDocsLoaderResult;
  } else {
    const [{ data }, docData] = await Promise.all([
      client.query<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>({
        query: NotifierLiquidAssignsQueryDocument,
        variables: { eventKey: notifierEventKey as NotificationEventKey },
      }),
      loadDocData(),
    ]);
    return { notifierEventKey, ...extractCommonFields(data, docData) } satisfies LiquidDocsLoaderResult;
  }
};

export function useLiquidDocs() {
  return useRouteLoaderData(NamedRoute.LiquidDocs) as LiquidDocsLoaderResult;
}
