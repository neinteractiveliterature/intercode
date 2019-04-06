import React from 'react';
import PropTypes from 'prop-types';
import { Link, Switch, Route } from 'react-router-dom';

import EditRun from './EditRun';
import RecurringEventSection from './RecurringEventSection';
import { EventAdminEventsQuery } from './queries.gql';
import NewEventForm from './NewEventForm';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';

function NewRecurringEvent({ history, ...props }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <NewEventForm
      onExit={() => history.push('/recurring_events')}
      convention={data.convention}
      schedulingUi="recurring"
      {...props}
    />
  );
}

NewRecurringEvent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

function RecurringEventAdminList() {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

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
      <Link className="btn btn-primary mt-4" to="/recurring_events/new">
        Create new recurring event
      </Link>
      <hr className="my-4" />
      {eventSections}
      <Route path="/recurring_events/:eventId/runs/:runId/edit">
        {props => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      </Route>
    </div>
  );
}

function RecurringEventAdmin() {
  return (
    <Switch>
      <Route path="/recurring_events/new" component={NewRecurringEvent} />
      <Route component={RecurringEventAdminList} />
    </Switch>
  );
}

export default RecurringEventAdmin;
