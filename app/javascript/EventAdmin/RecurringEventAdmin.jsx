import React from 'react';
import { Link, Route } from 'react-router-dom';

import EditRun from './EditRun';
import RecurringEventSection from './RecurringEventSection';
import { EventAdminEventsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';

function RecurringEventAdmin() {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  usePageTitle('Recurring Events');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const volunteerEvents = data.events.filter((event) => {
    const eventCategory = data.convention.event_categories
      .find(c => c.id === event.event_category.id);
    return eventCategory.scheduling_ui === 'recurring' && event.status === 'active';
  });
  volunteerEvents.sort((a, b) => a.title.localeCompare(b.title, { sensitivity: 'base' }));
  const eventSections = volunteerEvents.map(event => (
    <RecurringEventSection
      convention={data.convention}
      event={event}
      key={event.id}
    />
  ));

  return (
    <div>
      <Link className="btn btn-primary mt-4" to="/admin_events/recurring_events/new">
        Create new recurring event
      </Link>
      <hr className="my-4" />
      {eventSections}
      <Route path="/admin_events/recurring_events/:eventId/runs/:runId/edit">
        {props => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      </Route>
    </div>
  );
}

export default RecurringEventAdmin;
