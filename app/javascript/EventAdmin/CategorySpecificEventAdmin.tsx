import { Outlet } from 'react-router';
import { CategorySpecificEventAdminQueryDocument } from './queries.generated';
import EventAdminRunsTable from './EventAdminRunsTable';
import RecurringEventAdmin from './RecurringEventAdmin';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import { Route } from './+types/CategorySpecificEventAdmin';
import { SchedulingUi } from 'graphqlTypes.generated';
import range from 'lodash/range';

export type CategorySpecificEventAdminComponentProps = { data: Route.ComponentProps['loaderData'] };

export const adminComponentsBySchedulingUi: Record<
  SchedulingUi,
  React.ComponentType<CategorySpecificEventAdminComponentProps>
> = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

export async function loader({ params: { eventCategoryId }, context }: Route.LoaderArgs) {
  const eventCategoryIdIntPortion = Number.parseInt(eventCategoryId ?? '');
  if (Number.isNaN(eventCategoryIdIntPortion)) {
    throw new Response(null, { status: 404 });
  }

  const { data } = await context.client.query({
    query: CategorySpecificEventAdminQueryDocument,
    variables: { eventCategoryId },
  });

  if (data.convention.event_category.events_paginated.total_pages > 1) {
    const pagesToFetch = range(2, data.convention.event_category.events_paginated.total_pages + 1);
    const fetchedPages = await Promise.all(
      pagesToFetch.map(async (page) => {
        const { data } = await context.client.query({
          query: CategorySpecificEventAdminQueryDocument,
          variables: { eventCategoryId, page },
        });

        return data;
      }),
    );

    return {
      ...data,
      convention: {
        ...data.convention,
        event_category: {
          ...data.convention.event_category,
          events_paginated: {
            ...data.convention.event_category.events_paginated,
            entries: [
              ...data.convention.event_category.events_paginated.entries,
              ...fetchedPages.flatMap((pageData) => pageData.convention.event_category.events_paginated.entries),
            ],
          },
        },
      },
    };
  } else {
    return data;
  }
}

function CategorySpecificEventAdmin({ loaderData: data }: Route.ComponentProps) {
  const AdminComponent = adminComponentsBySchedulingUi[data.convention.event_category.scheduling_ui];
  return (
    <>
      <AdminComponent data={data} />
      <Outlet />
    </>
  );
}

export default CategorySpecificEventAdmin;
