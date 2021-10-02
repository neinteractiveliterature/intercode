import { Route, Link } from 'react-router-dom';
import { pluralize } from 'inflected';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import usePageTitle from '../usePageTitle';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useEventAdminCategory from './useEventAdminCategory';
import {
  EventAdminEventsQueryData,
  EventAdminEventsQueryVariables,
  useEventAdminEventsQuery,
} from './queries.generated';

export type EventAdminRunsTableProps = {
  eventCategoryId: number;
};

export default LoadQueryWrapper<
  EventAdminEventsQueryData,
  EventAdminEventsQueryVariables,
  EventAdminRunsTableProps
>(useEventAdminEventsQuery, function EventAdminRunsTable({ eventCategoryId, data }) {
  const [eventCategory, sortedEvents] = useEventAdminCategory(data, eventCategoryId);

  usePageTitle(pluralize(eventCategory?.name ?? ''));

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
            <EventAdminRow event={event} convention={data.convention} key={event.id} />
          ))}
        </tbody>
      </table>

      <Route path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}>
        <EditRun events={data.convention.events} convention={data.convention} />
      </Route>
      <Route path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/new`}>
        <EditRun events={data.convention.events} convention={data.convention} />
      </Route>
    </div>
  );
});
