import { useCallback, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import {
  ErrorDisplay,
  PageLoadingIndicator,
  useCreateMutationWithReferenceArrayUpdater,
  useDeleteMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import useEventForm, { EventForm } from '../../EventAdmin/useEventForm';
import useMEPTOMutations from '../../BuiltInFormControls/useMEPTOMutations';
import EditEvent from '../../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import {
  useStandaloneEditEventQuery,
  StandaloneEditEventQueryData,
  StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc,
} from './queries.generated';
import deserializeFormResponse, { WithFormResponse } from '../../Models/deserializeFormResponse';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import {
  useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation,
  useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation,
  useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation,
  useStandaloneUpdateEventMutation,
} from './mutations.generated';
import FourOhFourPage from '../../FourOhFourPage';

export type StandaloneEditEventFormProps = {
  initialEvent: WithFormResponse<StandaloneEditEventQueryData['convention']['event']>;
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

  const [createMutate] = useCreateMutationWithReferenceArrayUpdater(
    useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation,
    initialEvent,
    'maximum_event_provided_tickets_overrides',
    (data) => data.createMaximumEventProvidedTicketsOverride.maximum_event_provided_tickets_override,
    StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc,
    'StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields',
  );
  const [updateMutate] = useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation();
  const [deleteMutate] = useDeleteMutationWithReferenceArrayUpdater(
    useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation,
    initialEvent,
    'maximum_event_provided_tickets_overrides',
    (mepto) => ({ input: { id: mepto.id } }),
  );

  const meptoMutations = useMEPTOMutations({
    createMutate,
    updateMutate,
    deleteMutate,
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
      <EventForm {...eventFormProps} />
      {currentAbility.can_override_maximum_event_provided_tickets && convention.ticket_mode !== 'disabled' && (
        <MaximumEventProvidedTicketsOverrideEditor
          {...meptoMutations}
          ticketName={convention.ticket_name}
          ticketTypes={convention.ticket_types}
          // we use initialEvent here because we want it to be controlled by the query result
          overrides={initialEvent.maximum_event_provided_tickets_overrides}
          eventId={initialEvent.id}
        />
      )}
    </EditEvent>
  );
}

export type StandaloneEditEventProps = {
  eventId: string;
  eventPath: string;
};

function StandaloneEditEvent({ eventId, eventPath }: StandaloneEditEventProps): JSX.Element {
  const { data, loading, error } = useStandaloneEditEventQuery({ variables: { eventId } });

  const initialEvent = useMemo(
    () => (error || loading || !data ? null : deserializeFormResponse(data.convention.event)),
    [error, loading, data],
  );

  usePageTitle(useValueUnless(() => `Editing “${initialEvent?.title}”`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data || !initialEvent) {
    return <FourOhFourPage />;
  }

  if (data && !data.currentAbility.can_update_event) {
    return <Redirect to="/" />;
  }

  return (
    <StandaloneEditEventForm
      initialEvent={initialEvent}
      eventForm={data.convention.event.event_category.event_form}
      convention={data.convention}
      eventPath={eventPath}
      currentAbility={data.currentAbility}
    />
  );
}

export default StandaloneEditEvent;
