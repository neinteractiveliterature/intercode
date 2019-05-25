import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { pluralize } from 'inflected';

import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import { EventAdminEventsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import { sortByLocaleString } from '../ValueUtils';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import buildEventCategoryUrl from './buildEventCategoryUrl';

const getNormalizedEventTitle = event => event.title
  .replace(/^(the|a|) /i, '')
  .replace(/[^A-Za-z0-9]/g, '')
  .toLocaleLowerCase();

function EventAdminRunsTable({ eventCategoryId }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  const filteredEvents = useMemo(
    () => (error ? [] : data.events.filter(event => event.event_category.id === eventCategoryId)),
    [data, error, eventCategoryId],
  );
  const sortedEvents = useMemo(
    () => sortByLocaleString(filteredEvents, getNormalizedEventTitle),
    [filteredEvents],
  );
  const eventCategory = useMemo(
    () => (error ? null : data.convention.event_categories.find(c => c.id === eventCategoryId)),
    [data, error, eventCategoryId],
  );

  usePageTitle(useValueUnless(() => pluralize(eventCategory.name), error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <Link to={`${buildEventCategoryUrl(eventCategory)}/new`} className="btn btn-primary mt-4 mb-2">
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
        path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}
        render={props => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      />
      <Route
        path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/new`}
        render={props => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      />
    </div>
  );
}

EventAdminRunsTable.propTypes = {
  eventCategoryId: PropTypes.number.isRequired,
};

export default EventAdminRunsTable;
