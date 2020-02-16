import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';

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
import PageLoadingIndicator from '../../PageLoadingIndicator';

function StandaloneEditEventForm({
  initialEvent, eventPath, eventForm, convention, currentAbility,
}) {
  const history = useHistory();
  const queryOptions = { variables: { eventId: initialEvent.id } };
  const apolloClient = useApolloClient();

  const [eventFormProps, { event, validateForm }] = useEventForm({
    convention, initialEvent, eventForm,
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

  return (
    <EditEvent
      event={event}
      validateForm={validateForm}
      updateEvent={updateEvent}
      onSave={() => { history.push(eventPath); }}
    >
      <EventForm {...eventFormProps}>
        {currentAbility.can_override_maximum_event_provided_tickets
          && convention.ticket_mode !== 'disabled'
          && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketName={convention.ticket_name}
              ticketTypes={convention.ticket_types}
              overrides={event.maximum_event_provided_tickets_overrides}
              eventId={event.id}
            />
          )}
      </EventForm>
    </EditEvent>
  );
}

StandaloneEditEventForm.propTypes = {
  eventPath: PropTypes.string.isRequired,
  convention: PropTypes.shape({
    ticket_mode: PropTypes.string.isRequired,
    ticket_name: PropTypes.string.isRequired,
    ticket_types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  initialEvent: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  currentAbility: PropTypes.shape({
    can_override_maximum_event_provided_tickets: PropTypes.bool.isRequired,
  }).isRequired,
  eventForm: PropTypes.shape({}).isRequired,
};

function StandaloneEditEvent({ eventId, eventPath }) {
  const queryOptions = { variables: { eventId } };
  const { data, loading, error } = useQuery(StandaloneEditEventQuery, queryOptions);

  const eventForm = useMemo(
    () => (error || loading ? null : deserializeForm(data.event.event_category.event_form)),
    [error, loading, data],
  );

  const initialEvent = useMemo(
    () => (error || loading ? null : deserializeEvent(data.event)),
    [error, loading, data],
  );

  usePageTitle(useValueUnless(() => `Editing “${initialEvent.title}”`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.currentAbility.can_update_event) {
    return <Redirect to="/" />;
  }

  return (
    <StandaloneEditEventForm
      initialEvent={initialEvent}
      eventForm={eventForm}
      convention={data.convention}
      eventPath={eventPath}
      currentAbility={data.currentAbility}
    />
  );
}

StandaloneEditEvent.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default StandaloneEditEvent;
