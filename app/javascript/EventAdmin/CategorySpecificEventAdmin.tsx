import { LoaderFunction, Outlet, useLoaderData } from 'react-router';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import EventAdminRunsTable from './EventAdminRunsTable';
import RecurringEventAdmin from './RecurringEventAdmin';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import { client } from '../useIntercodeApolloClient';

export const adminComponentsBySchedulingUi = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

export async function loader({ params: { eventCategoryId } }) {
  const { data } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });

  const eventCategoryIdIntPortion = Number.parseInt(eventCategoryId ?? '');
  if (Number.isNaN(eventCategoryIdIntPortion)) {
    return new Response(null, { status: 404 });
  }
  const eventCategory = data.convention.event_categories.find(
    (category) => Number.parseInt(category.id) === eventCategoryIdIntPortion,
  );

  if (!eventCategory) {
    return new Response(null, { status: 404 });
  }

  return eventCategory;
}

function CategorySpecificEventAdmin() {
  const eventCategory = useLoaderData() as EventAdminEventsQueryData['convention']['event_categories'][number];

  const AdminComponent = adminComponentsBySchedulingUi[eventCategory.scheduling_ui];
  return (
    <>
      <AdminComponent eventCategoryId={eventCategory.id} />
      <Outlet />
    </>
  );
}

export default CategorySpecificEventAdmin;
