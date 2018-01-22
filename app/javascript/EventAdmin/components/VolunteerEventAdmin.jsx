import React from 'react';
import { graphql } from 'react-apollo';
import { Link, Switch, Route } from 'react-router-dom';
import CreateVolunteerEventForm from './CreateVolunteerEventForm';
import EditRunModalContainer from '../containers/EditRunModalContainer';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import VolunteerEventSectionContainer from '../containers/VolunteerEventSectionContainer';
import eventsQuery from '../eventsQuery';

@graphql(eventsQuery)
@GraphQLQueryResultWrapper
class VolunteerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery).isRequired,
  };

  renderVolunteerEventsList = () => {
    const { data } = this.props;

    const volunteerEvents = data.events.filter(event => event.category === 'volunteer_event' && event.status === 'active');
    volunteerEvents.sort((a, b) => a.title.localeCompare(b.title, { sensitivity: 'base' }));
    const eventSections = volunteerEvents.map(event => (
      <VolunteerEventSectionContainer
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
        <EditRunModalContainer convention={data.convention} />
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
