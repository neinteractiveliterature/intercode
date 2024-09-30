import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { EventCategoryAdminQueryData, EventCategoryAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../appRoutes';

export const eventCategoryAdminLoader: LoaderFunction = async () => {
  const { data } = await client.query<EventCategoryAdminQueryData>({ query: EventCategoryAdminQueryDocument });
  return data;
};

export function useEventCategoryAdminLoader() {
  return useRouteLoaderData(NamedRoute.EventCategoryAdmin) as EventCategoryAdminQueryData;
}

export type SingleEventCategoryAdminLoaderResult = {
  data: EventCategoryAdminQueryData;
  eventCategory: EventCategoryAdminQueryData['convention']['event_categories'][number];
};

export const singleEventCategoryAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await eventCategoryAdminLoader({ params: {}, ...args })) as EventCategoryAdminQueryData;
  const eventCategory = data.convention.event_categories.find((eventCategory) => eventCategory.id === id);

  if (!eventCategory) {
    throw new Response(null, { status: 404 });
  }

  return { eventCategory, data } satisfies SingleEventCategoryAdminLoaderResult;
};
