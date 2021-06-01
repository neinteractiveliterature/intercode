import { Link } from 'react-router-dom';
import { pluralize } from 'inflected';
import { ErrorDisplay, useConfirm, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import { timespanFromRun } from '../TimespanUtils';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import useValueUnless from '../useValueUnless';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import { timezoneNameForConvention } from '../TimeUtils';
import { useEventAdminEventsQuery } from './queries.generated';
import { useDropEventMutation } from './mutations.generated';
import { useFormatRunTimespan } from '../EventsApp/runTimeFormatting';

export type SingleRunEventAdminListProps = {
  eventCategoryId: number;
};

function SingleRunEventAdminList({ eventCategoryId }: SingleRunEventAdminListProps) {
  const { data, loading, error } = useEventAdminEventsQuery();
  const [eventCategory, sortedEvents] = useEventAdminCategory(
    data,
    loading,
    error,
    eventCategoryId,
  );
  const formatRunTimespan = useFormatRunTimespan();

  const [drop] = useDropEventMutation();
  const confirm = useConfirm();

  usePageTitle(useValueUnless(() => pluralize(eventCategory!.name), error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const eventRows = sortedEvents.map((event) => {
    const run = event.runs[0];
    let timespan;
    if (run) {
      timespan = timespanFromRun(timezoneNameForConvention(data!.convention), event, run);
    }

    return (
      <tr>
        <th scope="row">
          <span
            className="rounded p-1 text-dark"
            style={getEventCategoryStyles({ eventCategory: eventCategory!, variant: 'default' })}
          >
            {event.title}
          </span>
        </th>
        <td>{timespan && formatRunTimespan(timespan, { formatType: 'short' })}</td>
        <td>
          <Link className="btn btn-secondary btn-sm" to={`/admin_events/${event.id}/edit`}>
            Edit
          </Link>{' '}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() =>
              confirm({
                prompt: 'Are you sure you want to drop this event?',
                action: () => drop({ variables: { input: { id: event.id } } }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })
            }
          >
            <i className="fa fa-trash-o" />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Link className="btn btn-primary my-4" to={`${buildEventCategoryUrl(eventCategory)}/new`}>
        {'Create new '}
        {eventCategory!.name.toLowerCase()}
      </Link>
      <table className="table table-striped">
        <tbody>{eventRows}</tbody>
      </table>
    </div>
  );
}

export default SingleRunEventAdminList;
