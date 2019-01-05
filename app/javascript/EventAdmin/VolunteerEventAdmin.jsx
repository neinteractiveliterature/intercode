import React from 'react';
import { graphql } from 'react-apollo';
import { Link, Switch, Route } from 'react-router-dom';

import CreateVolunteerEventForm from './CreateVolunteerEventForm';
import EditRun from './EditRun';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import VolunteerEventSection from './VolunteerEventSection';
import { EventAdminEventsQuery } from './queries.gql';

@graphql(EventAdminEventsQuery)
@GraphQLQueryResultWrapper
class VolunteerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(EventAdminEventsQuery).isRequired,
  };

  renderVolunteerEventsList = () => {
    const { data } = this.props;

    const volunteerEvents = data.events.filter((event) => {
      const eventCategory = data.convention.event_categories
        .find(c => c.id === event.event_category.id);
      return eventCategory.scheduling_ui === 'recurring' && event.status === 'active';
    });
    volunteerEvents.sort((a, b) => a.title.localeCompare(b.title, { sensitivity: 'base' }));
    const eventSections = volunteerEvents.map(event => (
      <VolunteerEventSection
        convention={data.convention}
        event={event}
        key={event.id}
      />
    ));

    return (
      <div>
        <Link className="btn btn-primary mt-4" to="/volunteer_events/new">
          Create new volunteer event
        </Link>
        <hr className="my-4" />
        {eventSections}
        <Route path="/volunteer_events/:eventId/runs/:runId/edit">
          {props => (
            <EditRun {...props} events={data.events} convention={data.convention} />
          )}
        </Route>
      </div>
    );
  }

  renderCreateVolunteerEventForm = () => (
    <CreateVolunteerEventForm convention={this.props.data.convention} />
  )

  render = () => (
    <Switch>
      <Route path="/volunteer_events/new" render={this.renderCreateVolunteerEventForm} />
      <Route render={this.renderVolunteerEventsList} />
    </Switch>
  )
}

export default VolunteerEventAdmin;
