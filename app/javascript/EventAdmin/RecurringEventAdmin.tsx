import { Link, Route } from 'react-router-dom';
import { pluralize } from 'inflected';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import EditRun from './EditRun';
import RecurringEventSection from './RecurringEventSection';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import {
  EventAdminEventsQueryData,
  EventAdminEventsQueryVariables,
  useEventAdminEventsQuery,
} from './queries.generated';

export type RecurringEventAdminProps = {
  eventCategoryId: string;
};

export default LoadQueryWrapper<EventAdminEventsQueryData, EventAdminEventsQueryVariables, RecurringEventAdminProps>(
  useEventAdminEventsQuery,
  function RecurringEventAdmin({ data, eventCategoryId }): JSX.Element {
    const [eventCategory, sortedEvents] = useEventAdminCategory(data, eventCategoryId);

    usePageTitle(pluralize(eventCategory?.name ?? ''));

    return (
      <div>
        <Link className="btn btn-primary mt-4" to={`${buildEventCategoryUrl(eventCategory)}/new`}>
          {'Create new '}
          {eventCategory?.name.toLowerCase()}
        </Link>
        <hr className="my-4" />
        {sortedEvents.map((event) => (
          <RecurringEventSection convention={data.convention} event={event} key={event.id} />
        ))}
        <Route
          path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}
          render={() => <EditRun events={data.convention.events} convention={data.convention} />}
        />
      </div>
    );
  },
);
