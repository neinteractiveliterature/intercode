import { useCallback, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import useEventForm, { EventForm } from '../../EventAdmin/useEventForm';
import useMEPTOMutations from '../../BuiltInFormControls/useMEPTOMutations';
import EditEvent from '../../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import {
  useStandaloneEditEventQuery,
  StandaloneEditEventQueryData,
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
  initialEvent: WithFormResponse<StandaloneEditEventQueryData['event']>;
  eventPath: string;
  eventForm: CommonFormFieldsFragment;
  convention: NonNullable<StandaloneEditEventQueryData['convention']>;
  currentAbility: StandaloneEditEventQueryData['currentAbility'];
};

function StandaloneEditEventForm({
  initialEvent,
  eventPath,
  eventForm,
  convention,
  currentAbility,
}: StandaloneEditEventFormProps) {
  const history = useHistory();
  const apolloClient = useApolloClient();

  const [eventFormProps, { event, validateForm }] = useEventForm({
    convention,
    initialEvent,
    eventForm,
  });

  const [updateEventMutate] = useStandaloneUpdateEventMutation();
  const updateEvent = useCallback(async () => {
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
  }, [apolloClient, event, updateEventMutate]);

  const [createMutate] = useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation();
  const [updateMutate] = useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation();
  const [deleteMutate] = useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation();

  const meptoMutations = useMEPTOMutations({
    createMutate,
    updateMutate,
    deleteMutate,
    createUpdater: useCallback(
      (store, updatedEventId, override) => {
        const queryOptions = { variables: { eventId: initialEvent.id } };
        const storeData = store.readQuery<StandaloneEditEventQueryData>({
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
      [initialEvent.id],
    ),
    deleteUpdater: useCallback(
      (store, id) => {
        const queryOptions = { variables: { eventId: initialEvent.id } };
        const storeData = store.readQuery<StandaloneEditEventQueryData>({
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
              maximum_event_provided_tickets_overrides:
                storeData.event.maximum_event_provided_tickets_overrides.filter(
                  (override) => override.id !== id,
                ),
            },
          },
        });
      },
      [initialEvent.id],
    ),
  });

  return (
    <EditEvent
      event={event}
      validateForm={validateForm}
      updateEvent={updateEvent}
      onSave={() => {
        history.push(eventPath);
      }}
    >
      <EventForm {...eventFormProps}>
        {currentAbility.can_override_maximum_event_provided_tickets &&
          convention.ticket_mode !== 'disabled' && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketName={convention.ticket_name}
              ticketTypes={convention.ticket_types}
              // we use initialEvent here because we want it to be controlled by the query result
              overrides={initialEvent.maximum_event_provided_tickets_overrides}
              eventId={initialEvent.id}
            />
          )}
      </EventForm>
    </EditEvent>
  );
}

export type StandaloneEditEventProps = {
  eventId: number;
  eventPath: string;
};

function StandaloneEditEvent({ eventId, eventPath }: StandaloneEditEventProps) {
  const { data, loading, error } = useStandaloneEditEventQuery({ variables: { eventId } });

  const initialEvent = useMemo(
    () => (error || loading || !data ? null : deserializeFormResponse(data.event)),
    [error, loading, data],
  );

  usePageTitle(useValueUnless(() => `Editing “${initialEvent?.title}”`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
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
