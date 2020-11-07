import { useState, useMemo, useContext } from 'react';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import AdminNotes from '../BuiltInFormControls/AdminNotes';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import Timespan from '../Timespan';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import AppRootContext from '../AppRootContext';
import {
  ConventionFieldsFragment,
  EventFieldsFragment,
  RunFieldsFragment,
} from './queries.generated';
import { useUpdateEventAdminNotesMutation } from './mutations.generated';

export type EventAdminRowProps = {
  event: EventFieldsFragment;
  convention: ConventionFieldsFragment;
};

function EventAdminRow({ event, convention }: EventAdminRowProps) {
  const { timezoneName } = useContext(AppRootContext);
  const [updateEventAdminNotes] = useUpdateEventAdminNotesMutation();
  const [expanded, setExpanded] = useState(false);

  const length = useMemo(() => moment.duration(event.length_seconds, 'seconds'), [
    event.length_seconds,
  ]);
  const eventCategory = useMemo(
    () => convention.event_categories.find((c) => c.id === event.event_category.id)!,
    [convention.event_categories, event.event_category],
  );

  const renderRun = (run: RunFieldsFragment) => {
    const start = moment(run.starts_at);
    const timespan = new Timespan(start, start.clone().add(event.length_seconds, 'seconds'));

    const [titleSuffix, scheduleNote] = ([
      ['title_suffix', 'font-weight-bold'],
      ['schedule_note', 'font-italic'],
    ] as const).map(([field, className]) => {
      if (run[field]) {
        return (
          <li key={field} className={className}>
            {run[field]}
          </li>
        );
      }

      return null;
    });

    const runMetadata = [
      titleSuffix,
      <li key="timespan">{timespan.humanizeInTimezone(timezoneName)}</li>,
      <li key="rooms">
        {run.rooms
          .map((room) => room.name)
          .sort()
          .join(', ')}
      </li>,
      scheduleNote,
    ];

    return (
      <Link
        to={`${buildEventCategoryUrl(eventCategory)}/${event.id}/runs/${run.id}/edit`}
        className="btn btn-secondary m-1 p-2 text-left"
        key={run.id}
      >
        <ul className="list-unstyled m-0">{runMetadata}</ul>
      </Link>
    );
  };

  const renderRuns = () => {
    if (expanded || event.runs.length <= 2) {
      const sortedRuns = [...event.runs].sort((a, b) =>
        moment(a.starts_at).diff(moment(b.starts_at)),
      );

      return (
        <div className="d-flex flex-wrap align-items-start" style={{ maxWidth: '50vw' }}>
          {sortedRuns.map(renderRun)}
          <Link
            className="btn btn-primary btn-sm m-1"
            to={`${buildEventCategoryUrl(eventCategory)}/${event.id}/runs/new`}
          >
            <i className="fa fa-plus" />
          </Link>
        </div>
      );
    }

    return (
      <button className="btn btn-outline-secondary" onClick={() => setExpanded(true)} type="button">
        Show {event.runs.length} runs
      </button>
    );
  };

  return (
    <tr>
      <td>
        <Link
          to={`/admin_events/${event.id}/edit`}
          className="rounded p-1 text-dark"
          style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
        >
          {event.title}
        </Link>{' '}
        <small>({eventCategory.name})</small>
        <div className="mt-2">
          <AdminNotes
            value={event.admin_notes ?? undefined}
            mutate={(adminNotes) =>
              updateEventAdminNotes({ variables: { eventId: event.id, adminNotes } })
            }
          />
        </div>
      </td>
      <td>
        {length.hours()}:{length.minutes().toString().padStart(2, '0')}
      </td>
      <td style={{ minWidth: '29em' }}>{renderRuns()}</td>
    </tr>
  );
}

export default EventAdminRow;
