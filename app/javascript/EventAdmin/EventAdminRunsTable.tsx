import { Route, Link } from 'react-router-dom';
import { pluralize } from 'inflected';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useEventAdminCategory from './useEventAdminCategory';
import { useEventAdminEventsQuery } from './queries.generated';

export type EventAdminRunsTableProps = {
  eventCategoryId: number;
};

function EventAdminRunsTable({ eventCategoryId }: EventAdminRunsTableProps) {
  const { data, loading, error } = useEventAdminEventsQuery();

  const [eventCategory, sortedEvents] = useEventAdminCategory(
    data,
    loading,
    error,
    eventCategoryId,
  );

  usePageTitle(useValueUnless(() => pluralize(eventCategory!.name), error || loading));

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <Link
        to={`${buildEventCategoryUrl(eventCategory)}/new`}
        className="btn btn-primary mt-4 mb-2"
      >
        {'Create new '}
        {eventCategory?.name.toLowerCase()}
      </Link>

      <table className="table table-striped no-top-border">
        <thead>
          <tr>
            <th style={{ minWidth: '200px' }}>Title</th>
            <th>Duration</th>
            <th>Runs</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event) => (
            <EventAdminRow event={event} convention={data!.convention!} key={event.id} />
          ))}
        </tbody>
      </table>

      <Route path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}>
        <EditRun events={data!.events} convention={data!.convention!} />
      </Route>
      <Route path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/new`}>
        <EditRun events={data!.events} convention={data!.convention!} />
      </Route>
    </div>
  );
}

export default EventAdminRunsTable;
