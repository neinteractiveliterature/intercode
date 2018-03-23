import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import EditEvent from '../BuiltInForms/EditEvent';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import deserializeEvent from '../EventAdmin/deserializeEvent';
import getFormForEventCategory from '../EventAdmin/getFormForEventCategory';

const ticketTypeFragment = gql`
fragment StandaloneEditEvent_TicketTypeFields on TicketType {
  id
  description
  maximum_event_provided_tickets
}
`;

const maximumEventProvidedTicketsOverrideFragment = gql`
fragment StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    ...StandaloneEditEvent_TicketTypeFields
  }

  id
  override_value
}

${ticketTypeFragment}
`;

const eventFragment = gql`
fragment StandaloneEditEvent_EventFields on Event {
  id
  title
  form_response_attrs_json

  maximum_event_provided_tickets_overrides {
    ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
  }
}

${maximumEventProvidedTicketsOverrideFragment}
`;

const eventFormDataFragment = gql`
fragment StandaloneEditEvent_EventFormData on Convention {
  starts_at
  ends_at
  timezone_name

  regular_event_form {
    form_api_json
  }

  volunteer_event_form {
    form_api_json
  }

  filler_event_form {
    form_api_json
  }
}
`;

const eventQuery = gql`
query($eventId: Int!) {
  myProfile {
    ability {
      can_override_maximum_event_provided_tickets
    }
  }

  convention {
    ticket_types {
      ...StandaloneEditEvent_TicketTypeFields
    }

    ticket_name

    ...StandaloneEditEvent_EventFormData
  }

  event(id: $eventId) {
    ...StandaloneEditEvent_EventFields
  }
}

${eventFragment}
${eventFormDataFragment}
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

export const createMaximumEventProvidedTicketsOverrideMutation = gql`
mutation($input: CreateMaximumEventProvidedTicketsOverrideInput!) {
  createMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
    }
  }
}

${maximumEventProvidedTicketsOverrideFragment}
`;

export const deleteMaximumEventProvidedTicketsOverrideMutation = gql`
mutation($input: DeleteMaximumEventProvidedTicketsOverrideInput!) {
  deleteMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
    }
  }
}

${maximumEventProvidedTicketsOverrideFragment}
`;

export const updateMaximumEventProvidedTicketsOverrideMutation = gql`
mutation($input: UpdateMaximumEventProvidedTicketsOverrideInput!) {
  updateMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
    }
  }
}

${maximumEventProvidedTicketsOverrideFragment}
`;

@flowRight([
  graphql(eventQuery),
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
              const data = store.readQuery({ query: eventQuery, variables: { eventId } });
              data.event.maximum_event_provided_tickets_overrides.push(override);
              store.writeQuery({ query: eventQuery, variables: { eventId }, data });
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
    props({ ownProps, mutate }) {
      return {
        deleteMaximumEventProvidedTicketsOverride(id) {
          return mutate({
            variables: {
              input: {
                id,
              },
            },

            update: (store) => {
              const data = store.readQuery({
                query: eventQuery,
                variables: { eventId: ownProps.eventId },
              });
              const newOverrides = data.event.maximum_event_provided_tickets_overrides
                .filter(override => override.id !== id);
              data.event.maximum_event_provided_tickets_overrides = newOverrides;
              store.writeQuery({
                query: eventQuery,
                variables: {
                  eventId: ownProps.eventId,
                },
                data,
              });
            },
          });
        },
      };
    },
  }),
])
@GraphQLQueryResultWrapper
class StandaloneEditEvent extends React.Component {
  static propTypes = {
    eventId: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    showDropButton: PropTypes.bool.isRequired,
    data: GraphQLResultPropType(eventQuery).isRequired,
    updateEvent: PropTypes.func.isRequired,
    dropEvent: PropTypes.func.isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  };

  render = () => {
    const {
      data,
      updateEvent,
      dropEvent,
      showDropButton,
      createMaximumEventProvidedTicketsOverride,
      deleteMaximumEventProvidedTicketsOverride,
      updateMaximumEventProvidedTicketsOverride,
    } = this.props;

    return (
      <EditEvent
        event={deserializeEvent(data.event)}
        onSave={() => { window.location.href = `/events/${data.event.id}`; }}
        onDrop={() => { window.location.href = '/events'; }}
        updateEvent={updateEvent}
        dropEvent={dropEvent}
        createMaximumEventProvidedTicketsOverride={createMaximumEventProvidedTicketsOverride}
        deleteMaximumEventProvidedTicketsOverride={deleteMaximumEventProvidedTicketsOverride}
        updateMaximumEventProvidedTicketsOverride={updateMaximumEventProvidedTicketsOverride}
        showDropButton={showDropButton}
        canOverrideMaximumEventProvidedTickets={
          data.myProfile.ability.can_override_maximum_event_provided_tickets
        }
        ticketTypes={data.convention.ticket_types}
        ticketName={data.convention.ticket_name}
        convention={data.convention}
        form={getFormForEventCategory(data.event, data.convention)}
      />
    );
  }
}

export default StandaloneEditEvent;
