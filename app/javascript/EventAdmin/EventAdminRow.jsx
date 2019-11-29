import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import AdminNotes from '../BuiltInFormControls/AdminNotes';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import Timespan from '../Timespan';
import { UpdateEventAdminNotes } from './mutations.gql';
import buildEventCategoryUrl from './buildEventCategoryUrl';

function EventAdminRow({ event, convention }) {
  const [updateEventAdminNotes] = useMutation(UpdateEventAdminNotes);
  const [expanded, setExpanded] = useState(false);

  const length = useMemo(
    () => moment.duration(event.length_seconds, 'seconds'),
    [event.length_seconds],
  );
  const eventCategory = useMemo(
    () => convention.event_categories.find((c) => c.id === event.event_category.id),
    [convention.event_categories, event.event_category],
  );

  const renderRun = (run) => {
    const start = moment(run.starts_at);
    const timespan = new Timespan(start, start.clone().add(event.length_seconds, 'seconds'));

    const [titleSuffix, scheduleNote] = [['title_suffix', 'font-weight-bold'], ['schedule_note', 'font-italic']].map(([field, className]) => {
      if (run[field]) {
        return <li key={field} className={className}>{run[field]}</li>;
      }

      return null;
    });

    const runMetadata = [
      titleSuffix,
      <li key="timespan">{timespan.humanizeInTimezone(convention.timezone_name)}</li>,
      <li key="rooms">{run.rooms.map((room) => room.name).sort().join(', ')}</li>,
      scheduleNote,
    ];

    return (
      <Link
        to={`${buildEventCategoryUrl(eventCategory)}/${event.id}/runs/${run.id}/edit`}
        className="btn btn-secondary m-1 p-2 text-left"
        key={run.id}
      >
        <ul className="list-unstyled m-0">
          {runMetadata}
        </ul>
      </Link>
    );
  };

  const renderRuns = () => {
    if (expanded || event.runs.length <= 2) {
      const sortedRuns = [...event.runs]
        .sort((a, b) => moment(a.starts_at).diff(moment(b.starts_at)));

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
        Show
        {' '}
        {event.runs.length}
        {' '}
        runs
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
        </Link>
        {' '}
        <small>
          (
          {eventCategory.name}
          )
        </small>
        <div className="mt-2">
          <AdminNotes
            value={event.admin_notes}
            mutate={(adminNotes) => {
              updateEventAdminNotes({ variables: { eventId: event.id, adminNotes } });
            }}
          />
        </div>
      </td>
      <td>
        {length.hours()}
        :
        {length.minutes().toString().padStart(2, '0')}
      </td>
      <td style={{ minWidth: '29em' }}>{renderRuns(event)}</td>
    </tr>
  );
}

EventAdminRow.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    length_seconds: PropTypes.number.isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      starts_at: PropTypes.string.isRequired,
      title_suffix: PropTypes.string,
      schedule_note: PropTypes.string,
      rooms: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired).isRequired,
    }).isRequired).isRequired,
  }).isRequired,

  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
    event_categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
};

export default EventAdminRow;
