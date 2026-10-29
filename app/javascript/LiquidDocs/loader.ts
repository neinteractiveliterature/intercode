import { LoaderFunctionArgs } from 'react-router';
import keyBy from 'lodash/keyBy';

import {
  LiquidAssignsQueryData,
  LiquidAssignsQueryDocument,
  NotifierLiquidAssignsQueryData,
  NotifierLiquidAssignsQueryDocument,
} from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { loadDocData, YardDocs } from './DocData';
import { NamedRoute } from '../NamedRoute';
import useRequiredRouteLoaderData from '../useRequiredRouteLoaderData';
import findLiquidTagName from './findLiquidTagName';
import { NotificationEventKey } from 'graphqlTypes.generated';

// What the loader returns, for the components that take a piece of it as a prop
export type LiquidDocsLoaderResult = Awaited<ReturnType<typeof liquidDocsLoader>>;

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

function extractCommonFields(
  data: LiquidAssignsQueryData | NotifierLiquidAssignsQueryData | null | undefined,
  docData: YardDocs,
) {
  const sortedAssigns = sortByName(data?.cmsParent.liquidAssigns ?? []);
  const sortedFilters = sortByName(docData.filter_methods);
  const sortedTags = sortByName(docData.classes.filter((klass) => findLiquidTagName(klass) != null));
  const assigns = keyBy(sortedAssigns, (assign) => assign.name);
  const filters = keyBy(sortedFilters, (filter) => filter.name);
  const tags = keyBy(sortedTags, (klass) => findLiquidTagName(klass) ?? '');

  return { assigns, filters, tags, sortedAssigns, sortedFilters, sortedTags, docData };
}

export const liquidDocsLoader = async ({ context, request }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const notifierEventKey = new URL(request.url).searchParams.get('notifier_event_key');

  if (notifierEventKey == null) {
    const [{ data }, docData] = await Promise.all([
      client.query({
        query: LiquidAssignsQueryDocument,
        errorPolicy: 'none',
      }),
      loadDocData(),
    ]);
    return { notifierEventKey, ...extractCommonFields(data, docData) };
  } else {
    const [{ data }, docData] = await Promise.all([
      client.query({
        query: NotifierLiquidAssignsQueryDocument,
        variables: { eventKey: notifierEventKey as NotificationEventKey },
        errorPolicy: 'none',
      }),
      loadDocData(),
    ]);
    return { notifierEventKey, ...extractCommonFields(data, docData) };
  }
};

export function useLiquidDocs() {
  return useRequiredRouteLoaderData<typeof liquidDocsLoader>(NamedRoute.LiquidDocs);
}
