import { Outlet, useLoaderData } from 'react-router';
import { EventAdminEventsQueryDocument } from './queries.generated';
import EventAdminRunsTable from './EventAdminRunsTable';
import RecurringEventAdmin from './RecurringEventAdmin';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import { apolloClientContext } from 'AppContexts';
import type { Route } from './+types/CategorySpecificEventAdmin';

export const adminComponentsBySchedulingUi = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

export const clientLoader = async ({ params: { eventCategoryId }, context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument, errorPolicy: 'none' });

  const eventCategoryIdIntPortion = Number.parseInt(eventCategoryId ?? '');
  if (Number.isNaN(eventCategoryIdIntPortion)) {
    return new Response(null, { status: 404 });
  }
  const eventCategory = data?.convention.event_categories.find(
    (category) => Number.parseInt(category.id) === eventCategoryIdIntPortion,
  );

  if (!eventCategory) {
    return new Response(null, { status: 404 });
  }

  return eventCategory;
};

function CategorySpecificEventAdmin() {
  const eventCategory = useLoaderData<typeof clientLoader>();

  const AdminComponent = adminComponentsBySchedulingUi[eventCategory.scheduling_ui];
  return (
    <>
      <AdminComponent eventCategoryId={eventCategory.id} />
      <Outlet />
    </>
  );
}

export default CategorySpecificEventAdmin;
