import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import EditEvent from '../../BuiltInForms/EditEvent';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import deserializeEvent from '../deserializeEvent';
import eventsQuery from '../eventsQuery';
import getFormForEventCategory from '../getFormForEventCategory';
import {
  updateEventMutation,
  dropEventMutation,
  createMaximumEventProvidedTicketsOverrideMutation,
  deleteMaximumEventProvidedTicketsOverrideMutation,
  updateMaximumEventProvidedTicketsOverrideMutation,
} from '../mutations';

const EventAdminEditEvent = (props) => {
  const {
    data,
    match,
    history,
    updateEvent,
    dropEvent,
    createMaximumEventProvidedTicketsOverride,
    updateMaximumEventProvidedTicketsOverride,
    deleteMaximumEventProvidedTicketsOverride,
  } = props;
  const eventId = match.params.id;
  const event = data.events.find(e => e.id.toString() === eventId);

  return (
    <EditEvent
      event={deserializeEvent(event)}
      form={getFormForEventCategory(event, data.convention)}
      convention={data.convention}
      cancelPath="/runs"
      onSave={() => { history.push('/runs'); }}
      onDrop={() => { history.push('/runs'); }}
      updateEvent={updateEvent}
      dropEvent={dropEvent}
      createMaximumEventProvidedTicketsOverride={createMaximumEventProvidedTicketsOverride}
      updateMaximumEventProvidedTicketsOverride={updateMaximumEventProvidedTicketsOverride}
      deleteMaximumEventProvidedTicketsOverride={deleteMaximumEventProvidedTicketsOverride}
      ticketTypes={data.convention.ticket_types}
      ticketName={data.convention.ticket_name}
      canOverrideMaximumEventProvidedTickets={
        data.myProfile.ability.can_override_maximum_event_provided_tickets
      }
      showDropButton
    />
  );
};

EventAdminEditEvent.propTypes = {
  data: GraphQLResultPropType(eventsQuery).isRequired,
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
  createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
};

export default withRouter(flowRight([
  graphql(eventsQuery),
  graphql(updateEventMutation, { name: 'updateEvent' }),
  graphql(dropEventMutation, { name: 'dropEvent' }),
  graphql(createMaximumEventProvidedTicketsOverrideMutation, {
    props({ mutate }) {
      return {
        createMaximumEventProvidedTicketsOverride({ eventId, ticketTypeId, overrideValue }) {
          return mutate({
            variables: {
              input: {
                event_id: eventId,
                ticket_type_id: ticketTypeId,
                override_value: overrideValue,
              },
            },

            update: (store, {
              data: {
                createMaximumEventProvidedTicketsOverride: {
                  maximum_event_provided_tickets_override: override,
                },
              },
            }) => {
              const data = store.readQuery({ query: eventsQuery });
              const event = data.events.find(evt => evt.id === eventId);
              event.maximum_event_provided_tickets_overrides.push(override);
              store.writeQuery({ query: eventsQuery, data });
            },
          });
        },
      };
    },
  }),
  graphql(updateMaximumEventProvidedTicketsOverrideMutation, {
    props({ mutate }) {
      return {
        updateMaximumEventProvidedTicketsOverride({ id, overrideValue }) {
          return mutate({
            variables: {
              input: {
                id,
                override_value: overrideValue,
              },
            },
          });
        },
      };
    },
  }),
  graphql(deleteMaximumEventProvidedTicketsOverrideMutation, {
    props({ mutate }) {
      return {
        deleteMaximumEventProvidedTicketsOverride(id) {
          return mutate({
            variables: {
              input: {
                id,
              },
            },

            update: (store) => {
              const data = store.readQuery({ query: eventsQuery });
              const event = data.events.find((
                evt => evt.maximum_event_provided_tickets_overrides.some((
                  override => override.id === id
                ))
              ));
              const newOverrides = event.maximum_event_provided_tickets_overrides
                .filter(override => override.id !== id);
              event.maximum_event_provided_tickets_overrides = newOverrides;
              store.writeQuery({ query: eventsQuery, data });
            },
          });
        },
      };
    },
  }),
])(GraphQLQueryResultWrapper(EventAdminEditEvent)));
