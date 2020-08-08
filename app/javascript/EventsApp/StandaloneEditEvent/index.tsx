import React, { useCallback, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import ErrorDisplay from '../../ErrorDisplay';
import useEventForm, { EventForm } from '../../EventAdmin/useEventForm';
import useMEPTOMutations from '../../BuiltInFormControls/useMEPTOMutations';
import EditEvent from '../../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import {
  useStandaloneEditEventQueryQuery,
  StandaloneEditEventQueryQuery,
  StandaloneEditEventQueryDocument,
} from './queries.generated';
import deserializeFormResponse, { WithFormResponse } from '../../Models/deserializeFormResponse';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import {
  useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation,
  useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation,
  useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation,
  useStandaloneUpdateEventMutation,
} from './mutations.generated';

export type StandaloneEditEventFormProps = {
  initialEvent: WithFormResponse<StandaloneEditEventQueryQuery['event']>,
  eventPath: string,
  eventForm: CommonFormFieldsFragment,
  convention: NonNullable<StandaloneEditEventQueryQuery['convention']>,
  currentAbility: StandaloneEditEventQueryQuery['currentAbility'],
};

function StandaloneEditEventForm({
  initialEvent, eventPath, eventForm, convention, currentAbility,
}: StandaloneEditEventFormProps) {
  const history = useHistory();
  const queryOptions = { variables: { eventId: initialEvent.id } };
  const apolloClient = useApolloClient();

  const [eventFormProps, { event, validateForm }] = useEventForm({
    convention, initialEvent, eventForm,
  });

  const [updateEventMutate] = useStandaloneUpdateEventMutation();
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
    createMutate: useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation()[0],
    updateMutate: useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation()[0],
    deleteMutate: useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation()[0],
    createUpdater: useCallback(
      (store, updatedEventId, override) => {
        const storeData = store.readQuery<StandaloneEditEventQueryQuery>({
          query: StandaloneEditEventQueryDocument,
          ...queryOptions,
        });
        if (!storeData) {
          return;
        }
        store.writeQuery({
          query: StandaloneEditEventQueryDocument,
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
        const storeData = store.readQuery<StandaloneEditEventQueryQuery>({
          query: StandaloneEditEventQueryDocument,
          ...queryOptions,
        });
        if (!storeData) {
          return;
        }
        store.writeQuery({
          query: StandaloneEditEventQueryDocument,
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

export type StandaloneEditEventProps = {
  eventId: number,
  eventPath: string,
};

function StandaloneEditEvent({ eventId, eventPath }: StandaloneEditEventProps) {
  const { data, loading, error } = useStandaloneEditEventQueryQuery({ variables: { eventId } });

  const initialEvent = useMemo(
    () => (error || loading || !data ? null : deserializeFormResponse(data.event)),
    [error, loading, data],
  );

  usePageTitle(useValueUnless(() => `Editing “${initialEvent?.title}”`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (data && !data.currentAbility.can_update_event) {
    return <Redirect to="/" />;
  }

  return (
    <StandaloneEditEventForm
      initialEvent={initialEvent!}
      eventForm={data!.event.event_category.event_form}
      convention={data!.convention!}
      eventPath={eventPath}
      currentAbility={data!.currentAbility}
    />
  );
}

export default StandaloneEditEvent;
