import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { EventCategoryAdminQueryData, EventCategoryAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../AppRouter';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SingleEventCategoryRoute';

export const eventCategoryAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventCategoryAdminQueryDocument });
  return data;
};

export function useEventCategoryAdminLoader() {
  return useRouteLoaderData(NamedRoute.EventCategoryAdmin) as EventCategoryAdminQueryData;
}

export type SingleEventCategoryAdminLoaderResult = {
  data: EventCategoryAdminQueryData;
  eventCategory: EventCategoryAdminQueryData['convention']['event_categories'][number];
};

export const singleEventCategoryAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await eventCategoryAdminLoader({ params: {}, ...args });
  const eventCategory = data?.convention.event_categories.find((eventCategory) => eventCategory.id === id);

  if (!eventCategory) {
    throw new Response(null, { status: 404 });
  }

  return { eventCategory, data } satisfies SingleEventCategoryAdminLoaderResult;
};
