import React from 'react';
import { graphql } from 'react-apollo';
import EditRunModalContainer from '../containers/EditRunModalContainer';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import VolunteerEventSectionContainer from '../containers/VolunteerEventSectionContainer';
import eventsQuery from '../eventsQuery';

@graphql(eventsQuery)
@GraphQLQueryResultWrapper
class VolunteerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
  };

  render = () => {
    const { data } = this.props;

    const volunteerEvents = data.events.filter(event => event.category === 'volunteer_event');
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
        {eventSections}
        <EditRunModalContainer convention={this.props.data.convention} />
      </div>
    );
  }
}

export default VolunteerEventAdmin;
