import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import EditEvent from '../../BuiltInForms/EditEvent';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import eventsQuery from '../eventsQuery';
import { updateEventMutation, dropEventMutation } from '../mutations';

const EventAdminEditEvent = ({
  data, match, history, updateEvent, dropEvent,
}) => {
  const eventId = match.params.id;
  const event = data.events.find(e => e.id.toString() === eventId);

  return (
    <EditEvent
      event={event}
      cancelPath="/runs"
      onSave={() => { history.push('/runs'); }}
      onDrop={() => { history.push('/runs'); }}
      updateEvent={updateEvent}
      dropEvent={dropEvent}
      showDropButton
    />
  );
};

EventAdminEditEvent.propTypes = {
  data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateEvent: PropTypes.func.isRequired,
  dropEvent: PropTypes.func.isRequired,
};

export default withRouter(compose(
  graphql(eventsQuery),
  graphql(updateEventMutation, { name: 'updateEvent' }),
  graphql(dropEventMutation, { name: 'dropEvent' }),
)(GraphQLQueryResultWrapper(EventAdminEditEvent)));
