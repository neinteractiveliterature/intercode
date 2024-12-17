import { Outlet } from 'react-router';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import EventAdminRunsTable from './EventAdminRunsTable';
import RecurringEventAdmin from './RecurringEventAdmin';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import { Route } from './+types/CategorySpecificEventAdmin';
import { SchedulingUi } from 'graphqlTypes.generated';

export type CategorySpecificEventAdminComponentProps = Route.ComponentProps['loaderData'] & {
  eventCategoryId: string;
};

export const adminComponentsBySchedulingUi: Record<
  SchedulingUi,
  React.ComponentType<CategorySpecificEventAdminComponentProps>
> = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

export async function loader({ params: { eventCategoryId }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });

  const eventCategoryIdIntPortion = Number.parseInt(eventCategoryId ?? '');
  if (Number.isNaN(eventCategoryIdIntPortion)) {
    throw new Response(null, { status: 404 });
  }
  const eventCategory = data.convention.event_categories.find(
    (category) => Number.parseInt(category.id) === eventCategoryIdIntPortion,
  );

  if (!eventCategory) {
    throw new Response(null, { status: 404 });
  }

  return { data, eventCategory };
}

function CategorySpecificEventAdmin({ loaderData: data }: Route.ComponentProps) {
  const AdminComponent = adminComponentsBySchedulingUi[data.eventCategory.scheduling_ui];
  return (
    <>
      <AdminComponent eventCategoryId={data.eventCategory.id} {...data} />
      <Outlet />
    </>
  );
}

export default CategorySpecificEventAdmin;
