import React from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import EditEvent from '../BuiltInForms/EditEvent';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import StandaloneGraphQLComponent from '../StandaloneGraphQLComponent';

const eventFragment = gql`
fragment StandaloneEditEvent_EventFields on Event {
  id
  title
  author
  description
  organization
  url
  con_mail_destination
  can_play_concurrently
  short_blurb
  participant_communications
  email
  length_seconds
  category
  status
  description_html

  registration_policy {
    buckets {
      key
      name
      description
      minimum_slots
      preferred_slots
      total_slots
      slots_limited
      anything
    }
  }
}
`;

const eventQuery = gql`
query($eventId: Int!) {
  event(id: $eventId) {
    ...StandaloneEditEvent_EventFields
  }
}

${eventFragment}
`;

export const dropEventMutation = gql`
mutation($input: DropEventInput!) {
  dropEvent(input: $input) {
    event {
      id
      status
    }
  }
}
`;

export const updateEventMutation = gql`
mutation($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    event {
      ...StandaloneEditEvent_EventFields
    }
  }
}

${eventFragment}
`;

@StandaloneGraphQLComponent
@compose(
  graphql(eventQuery),
  graphql(updateEventMutation, { name: 'updateEvent' }),
  graphql(dropEventMutation, { name: 'dropEvent' }),
)
@GraphQLQueryResultWrapper
class StandaloneEditEvent extends React.Component {
  static propTypes = {
    eventId: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    showDropButton: PropTypes.bool.isRequired,
    data: GraphQLResultPropType(eventQuery, 'event').isRequired,
    updateEvent: PropTypes.func.isRequired,
    dropEvent: PropTypes.func.isRequired,
  };

  render = () => {
    const { data, updateEvent, dropEvent, showDropButton } = this.props;

    return (
      <EditEvent
        event={data.event}
        onSave={() => { window.location.href = `/events/${data.event.id}`; }}
        onDrop={() => { window.location.href = '/events'; }}
        updateEvent={updateEvent}
        dropEvent={dropEvent}
        showDropButton={showDropButton}
      />
    );
  }
}

export default StandaloneEditEvent;
