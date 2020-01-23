import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { useApolloClient, useMutation } from 'react-apollo-hooks';

import deserializeEvent from '../../EventAdmin/deserializeEvent';
import { deserializeForm } from '../../FormPresenter/GraphQLFormDeserialization';
import ErrorDisplay from '../../ErrorDisplay';
import { StandaloneEditEventQuery } from './queries.gql';
import {
  StandaloneUpdateEvent,
  StandaloneCreateMaximumEventProvidedTicketsOverride,
  StandaloneDeleteMaximumEventProvidedTicketsOverride,
  StandaloneUpdateMaximumEventProvidedTicketsOverride,
} from './mutations.gql';
import useEventForm, { EventForm } from '../../EventAdmin/useEventForm';
import useMEPTOMutations from '../../BuiltInFormControls/useMEPTOMutations';
import EditEvent from '../../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import useQuerySuspended from '../../useQuerySuspended';

function StandaloneEditEvent({ eventId, eventPath, history }) {
  const queryOptions = { variables: { eventId } };
  const { data, error } = useQuerySuspended(StandaloneEditEventQuery, queryOptions);
  const apolloClient = useApolloClient();

  const initialEvent = deserializeEvent(data.event);

  usePageTitle(useValueUnless(() => `Editing “${initialEvent.title}”`, error));

  const [eventFormProps, { event, validateForm }] = useEventForm({
    convention: data.convention,
    initialEvent,
    eventForm: deserializeForm(data.event.event_category.event_form),
  });

  const [updateEventMutate] = useMutation(StandaloneUpdateEvent);
  const updateEvent = useCallback(
    async () => {
      await updateEventMutate({
        variables: {
          input: {
            id: event.id,
            event: {
              form_response_attrs_json: JSON.stringify(event.form_response_attrs),
            },
          },
        },
      });
      await apolloClient.resetStore();
    },
    [apolloClient, event, updateEventMutate],
  );

  const meptoMutations = useMEPTOMutations({
    createMutate: useMutation(StandaloneCreateMaximumEventProvidedTicketsOverride)[0],
    updateMutate: useMutation(StandaloneUpdateMaximumEventProvidedTicketsOverride)[0],
    deleteMutate: useMutation(StandaloneDeleteMaximumEventProvidedTicketsOverride)[0],
    createUpdater: useCallback(
      (store, updatedEventId, override) => {
        const storeData = store.readQuery({
          query: StandaloneEditEventQuery,
          ...queryOptions,
        });
        store.writeQuery({
          query: StandaloneEditEventQuery,
          ...queryOptions,
          data: {
            ...storeData,
            event: {
              ...storeData.event,
              maximum_event_provided_tickets_overrides: [
                ...storeData.event.maximum_event_provided_tickets_overrides,
                override,
              ],
            },
          },
        });
      },
      [queryOptions],
    ),
    deleteUpdater: useCallback(
      (store, id) => {
        const storeData = store.readQuery({
          query: StandaloneEditEventQuery,
          ...queryOptions,
        });
        store.writeQuery({
          query: StandaloneEditEventQuery,
          ...queryOptions,
          data: {
            ...storeData,
            event: {
              ...storeData.event,
              maximum_event_provided_tickets_overrides: storeData
                .event.maximum_event_provided_tickets_overrides
                .filter((override) => override.id !== id),
            },
          },
        });
      },
      [queryOptions],
    ),
  });

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.currentAbility.can_update_event) {
    return <Redirect to="/" />;
  }

  return (
    <EditEvent
      event={event}
      validateForm={validateForm}
      updateEvent={updateEvent}
      onSave={() => { history.push(eventPath); }}
    >
      <EventForm {...eventFormProps}>
        {data.currentAbility.can_override_maximum_event_provided_tickets
          && data.convention.ticket_mode !== 'disabled'
          && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketName={data.convention.ticket_name}
              ticketTypes={data.convention.ticket_types}
              overrides={data.event.maximum_event_provided_tickets_overrides}
              eventId={data.event.id}
            />
          )}
      </EventForm>
    </EditEvent>
  );
}

StandaloneEditEvent.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(StandaloneEditEvent);
