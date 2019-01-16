import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import PropTypes from 'prop-types';

import EditEvent from '../../BuiltInForms/EditEvent';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import deserializeEvent from '../../EventAdmin/deserializeEvent';
import { deserializeForm } from '../../FormPresenter/GraphQLFormDeserialization';
import { StandaloneEditEventQuery } from './queries.gql';
import {
  StandaloneDropEvent,
  StandaloneUpdateEvent,
  StandaloneCreateMaximumEventProvidedTicketsOverride,
  StandaloneDeleteMaximumEventProvidedTicketsOverride,
  StandaloneUpdateMaximumEventProvidedTicketsOverride,
} from './mutations.gql';

@flowRight([
  graphql(StandaloneEditEventQuery),
  graphql(StandaloneUpdateEvent, { name: 'updateEvent' }),
  graphql(StandaloneDropEvent, { name: 'dropEvent' }),
  graphql(StandaloneCreateMaximumEventProvidedTicketsOverride, {
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
              const data = store.readQuery({
                query: StandaloneEditEventQuery,
                variables: { eventId },
              });
              data.event.maximum_event_provided_tickets_overrides.push(override);
              store.writeQuery({ query: StandaloneEditEventQuery, variables: { eventId }, data });
            },
          });
        },
      };
    },
  }),
  graphql(StandaloneUpdateMaximumEventProvidedTicketsOverride, {
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
  graphql(StandaloneDeleteMaximumEventProvidedTicketsOverride, {
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
                query: StandaloneEditEventQuery,
                variables: { eventId: ownProps.eventId },
              });
              const newOverrides = data.event.maximum_event_provided_tickets_overrides
                .filter(override => override.id !== id);
              data.event.maximum_event_provided_tickets_overrides = newOverrides;
              store.writeQuery({
                query: StandaloneEditEventQuery,
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
    data: GraphQLResultPropType(StandaloneEditEventQuery).isRequired,
    updateEvent: PropTypes.func.isRequired,
    dropEvent: PropTypes.func.isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    window.document.title = `Edit ${this.props.data.event.title} - ${this.props.data.convention.name}`;
  }

  render = () => {
    const {
      data,
      updateEvent,
      dropEvent,
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
        showDropButton={data.currentAbility.can_delete_event}
        canOverrideMaximumEventProvidedTickets={
          data.currentAbility.can_override_maximum_event_provided_tickets
        }
        ticketTypes={data.convention.ticket_types}
        ticketName={data.convention.ticket_name}
        convention={data.convention}
        form={deserializeForm(data.event.event_category.event_form)}
      />
    );
  }
}

export default StandaloneEditEvent;
