import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { EventCategoryAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../NamedRoute';
import useRequiredRouteLoaderData from '../useRequiredRouteLoaderData';

export const eventCategoryAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventCategoryAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useEventCategoryAdminLoader() {
  return useRequiredRouteLoaderData<typeof eventCategoryAdminLoader>(NamedRoute.EventCategoryAdmin);
}

export const singleEventCategoryAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await eventCategoryAdminLoader({ params: {}, ...args });
  const eventCategory = data.convention.event_categories.find((eventCategory) => eventCategory.id === id);

  if (!eventCategory) {
    throw new Response(null, { status: 404 });
  }

  return { eventCategory, data };
};
