import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import EditEvent from '../BuiltInForms/EditEvent';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import deserializeEvent from './deserializeEvent';
import { EventAdminEventsQuery } from './queries.gql';
import getFormForEventCategory from './getFormForEventCategory';
import {
  UpdateEvent,
  DropEvent,
  CreateMaximumEventProvidedTicketsOverride,
  UpdateMaximumEventProvidedTicketsOverride,
  DeleteMaximumEventProvidedTicketsOverride,
} from './mutations.gql';

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
        data.currentAbility.can_override_maximum_event_provided_tickets
      }
      showDropButton
      showCategorySelect
    />
  );
};

EventAdminEditEvent.propTypes = {
  data: GraphQLResultPropType(EventAdminEventsQuery).isRequired,
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
  graphql(EventAdminEventsQuery),
  graphql(UpdateEvent, { name: 'updateEvent' }),
  graphql(DropEvent, { name: 'dropEvent' }),
  graphql(CreateMaximumEventProvidedTicketsOverride, {
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
              const data = store.readQuery({ query: EventAdminEventsQuery });
              const event = data.events.find(evt => evt.id === eventId);
              event.maximum_event_provided_tickets_overrides.push(override);
              store.writeQuery({ query: EventAdminEventsQuery, data });
            },
          });
        },
      };
    },
  }),
  graphql(UpdateMaximumEventProvidedTicketsOverride, {
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
  graphql(DeleteMaximumEventProvidedTicketsOverride, {
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
              const data = store.readQuery({ query: EventAdminEventsQuery });
              const event = data.events.find((
                evt => evt.maximum_event_provided_tickets_overrides.some((
                  override => override.id === id
                ))
              ));
              const newOverrides = event.maximum_event_provided_tickets_overrides
                .filter(override => override.id !== id);
              event.maximum_event_provided_tickets_overrides = newOverrides;
              store.writeQuery({ query: EventAdminEventsQuery, data });
            },
          });
        },
      };
    },
  }),
])(GraphQLQueryResultWrapper(EventAdminEditEvent)));
