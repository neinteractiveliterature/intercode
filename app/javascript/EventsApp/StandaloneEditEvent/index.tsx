import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  useStandaloneAttachImageToEventMutation,
} from './mutations.generated';
import FourOhFourPage from '../../FourOhFourPage';
import useLoginRequired from '../../Authentication/useLoginRequired';
import { AuthorizationError } from '../../Authentication/useAuthorizationRequired';
import buildEventUrl from '../buildEventUrl';
import { ImageAttachmentConfig } from '../../BuiltInFormControls/MarkdownInput';

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
  const navigate = useNavigate();
  const apolloClient = useApolloClient();
  const [attachImageToEvent] = useStandaloneAttachImageToEventMutation();
  const imageAttachmentConfig = useMemo<ImageAttachmentConfig>(
    () => ({
      addBlob: (blob) => attachImageToEvent({ variables: { id: initialEvent.id, signedBlobId: blob.signed_id } }),
      existingImages: initialEvent.images,
    }),
    [attachImageToEvent, initialEvent.images, initialEvent.id],
  );

  const [eventFormProps, { event, validateForm }] = useEventForm({
    convention,
    initialEvent,
    eventForm,
    imageAttachmentConfig,
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
        navigate(eventPath);
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

function StandaloneEditEvent(): JSX.Element {
  const eventId = useParams<{ eventId: string }>().eventId;
  const loginRequired = useLoginRequired();
  const { data, loading, error } = useStandaloneEditEventQuery({ variables: { eventId: eventId ?? '' } });

  const initialEvent = useMemo(
    () => (error || loading || !data ? null : deserializeFormResponse(data.convention.event)),
    [error, loading, data],
  );

  usePageTitle(useValueUnless(() => `Editing “${initialEvent?.title}”`, error || loading));

  if (loginRequired) {
    return <></>;
  }

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data || !initialEvent) {
    return <FourOhFourPage />;
  }

  if (!data.currentAbility.can_update_event) {
    return <AuthorizationError />;
  }

  return (
    <StandaloneEditEventForm
      initialEvent={initialEvent}
      eventForm={data.convention.event.event_category.event_form}
      convention={data.convention}
      eventPath={buildEventUrl(data.convention.event)}
      currentAbility={data.currentAbility}
    />
  );
}

export default StandaloneEditEvent;
