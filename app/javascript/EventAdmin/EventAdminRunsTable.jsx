import React from 'react';
import { Route, Link } from 'react-router-dom';

import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import { EventAdminEventsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import { sortByLocaleString } from '../ValueUtils';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

const getNormalizedEventTitle = event => event.title
  .replace(/^(the|a|) /i, '')
  .replace(/[^A-Za-z0-9]/g, '')
  .toLocaleLowerCase();

function EventAdminRunsTable() {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  usePageTitle('Regular Events', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const filteredEvents = data.events.filter((event) => {
    const eventCategory = data.convention.event_categories
      .find(c => c.id === event.event_category.id);

    return eventCategory.scheduling_ui === 'regular' && event.status === 'active';
  });

  const sortedEvents = sortByLocaleString(filteredEvents, getNormalizedEventTitle);

  return (
    <div>
      <Link to="/admin_events/new" className="btn btn-primary mt-4 mb-2">
        New event
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
          {sortedEvents.map(event => (
            <EventAdminRow
              event={event}
              convention={data.convention}
              key={event.id}
            />
          ))}
        </tbody>
      </table>

      <Route
        path="/admin_events/:eventId/runs/:runId/edit"
        render={props => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      />
      <Route
        path="/admin_events/:eventId/runs/new"
        render={props => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      />
    </div>
  );
}

export default EventAdminRunsTable;
