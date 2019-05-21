import React from 'react';
import { Link } from 'react-router-dom';

import { EventAdminEventsQuery } from './queries.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import { timespanFromRun } from '../TimespanUtils';
import { DropEvent } from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import useMutationCallback from '../useMutationCallback';
import { useConfirm } from '../ModalDialogs/Confirm';
import usePageTitle from '../usePageTitle';

function SingleRunEventAdminList() {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const drop = useMutationCallback(DropEvent);
  const confirm = useConfirm();

  usePageTitle('Single-Run Events');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const singleRunEvents = data.events.filter((event) => {
    const eventCategory = data.convention.event_categories
      .find(c => c.id === event.event_category.id);
    return eventCategory.scheduling_ui === 'single_run' && event.status === 'active';
  });
  singleRunEvents.sort((a, b) => {
    if (!a.runs[0]) {
      return -1;
    }

    if (!b.runs[0]) {
      return 1;
    }

    const timespanA = timespanFromRun(data.convention, a, a.runs[0]);
    const timespanB = timespanFromRun(data.convention, b, b.runs[0]);

    return timespanA.start.diff(timespanB.start);
  });
  const eventRows = singleRunEvents.map((event) => {
    const run = event.runs[0];
    let timespan;
    if (run) {
      timespan = timespanFromRun(data.convention, event, run);
    }

    const eventCategory = data.convention.event_categories
      .find(c => c.id === event.event_category.id);

    return (
      <tr className={event.id}>
        <th scope="row">
          <span
            className="rounded p-1 text-dark"
            style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
          >
            {event.title}
          </span>
        </th>
        <td>
          {timespan && timespan.humanizeInTimezone(data.convention.timezone_name)}
        </td>
        <td>
          <Link className="btn btn-secondary btn-sm" to={`/admin_events/filler_events/${event.id}/edit`}>
            Edit
          </Link>
          {' '}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => confirm({
              prompt: 'Are you sure you want to drop this event?',
              action: () => drop({ variables: { input: { id: event.id } } }),
              renderError: e => <ErrorDisplay graphQLError={e} />,
            })}
          >
            <i className="fa fa-trash-o" />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Link className="btn btn-primary my-4" to="/admin_events/filler_events/new">
        Create new single-run event
      </Link>
      <table className="table table-striped">
        <tbody>
          {eventRows}
        </tbody>
      </table>
    </div>
  );
}

export default SingleRunEventAdminList;
