import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useMEPTOMutations from '../BuiltInFormControls/useMEPTOMutations';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../usePageTitle';
import useUpdateEvent from './useUpdateEvent';
import RunFormFields, { RunFormFieldsProps } from '../BuiltInForms/RunFormFields';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import deserializeFormResponse from '../Models/deserializeFormResponse';
import {
  MaximumEventProvidedTicketsOverrideFieldsFragmentDoc,
  useEventAdminEventsQuerySuspenseQuery,
  useEventAdminSingleEventQuerySuspenseQuery,
} from './queries.generated';
import {
  useDropEventMutation,
  useCreateMaximumEventProvidedTicketsOverrideMutation,
  useUpdateMaximumEventProvidedTicketsOverrideMutation,
  useDeleteMaximumEventProvidedTicketsOverrideMutation,
  useAttachImageToEventMutation,
} from './mutations.generated';
import {
  useCreateMutationWithReferenceArrayUpdater,
  useDeleteMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform/dist';
import { ImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';

function EventAdminEditEvent() {
  const params = useParams();
  const {
    data: { convention, currentAbility },
  } = useEventAdminEventsQuerySuspenseQuery();
  const {
    data: {
      conventionByRequestHost: { event: serializedEvent },
    },
  } = useEventAdminSingleEventQuerySuspenseQuery({ variables: { eventId: params.id ?? '' } });
  const navigate = useNavigate();
  const initialEvent = useMemo(() => deserializeFormResponse(serializedEvent), [serializedEvent]);

  const meptoMutations = useMEPTOMutations({
    createMutate: useCreateMutationWithReferenceArrayUpdater(
      useCreateMaximumEventProvidedTicketsOverrideMutation,
      serializedEvent,
      'maximum_event_provided_tickets_overrides',
      (data) => data.createMaximumEventProvidedTicketsOverride.maximum_event_provided_tickets_override,
      MaximumEventProvidedTicketsOverrideFieldsFragmentDoc,
      'MaximumEventProvidedTicketsOverrideFields',
    )[0],
    updateMutate: useUpdateMaximumEventProvidedTicketsOverrideMutation()[0],
    deleteMutate: useDeleteMutationWithReferenceArrayUpdater(
      useDeleteMaximumEventProvidedTicketsOverrideMutation,
      serializedEvent,
      'maximum_event_provided_tickets_overrides',
      (mepto) => ({ input: { id: mepto.id } }),
    )[0],
  });

  const [run, setRun] = useState(initialEvent?.runs[0] || {});
  const [attachImageToEvent] = useAttachImageToEventMutation();

  const imageAttachmentConfig = useMemo<ImageAttachmentConfig>(
    () => ({
      addBlob: (blob) => attachImageToEvent({ variables: { id: serializedEvent.id, signedBlobId: blob.signed_id } }),
      existingImages: serializedEvent.images,
    }),
    [attachImageToEvent, serializedEvent.id, serializedEvent.images],
  );

  const [eventFormWithCategorySelectionProps, { event, eventCategory, validateForm }] =
    useEventFormWithCategorySelection({
      convention: convention,
      initialEvent,
      imageAttachmentConfig,
    });

  const eventForRunFormFields: RunFormFieldsProps<typeof run>['event'] = useMemo(
    () => ({
      __typename: 'Event',
      id: event.id,
      length_seconds:
        typeof event.form_response_attrs.length_seconds === 'number' ? event.form_response_attrs.length_seconds : 0,
      current_user_form_item_viewer_role: event.current_user_form_item_viewer_role,
      current_user_form_item_writer_role: event.current_user_form_item_writer_role,
      can_play_concurrently: event.can_play_concurrently ?? false,
      event_category: {
        __typename: 'EventCategory',
        id: '',
        name: 'fake category for single-run event UI',
        event_form: {
          __typename: 'Form',
          form_sections: [],
          id: '',
        },
      },
      maximum_event_provided_tickets_overrides: [],
      runs: [run],
      images: event.images,
    }),
    [run, event],
  );

  const updateEvent = useUpdateEvent();

  const [dropEventMutate] = useDropEventMutation();
  const dropEvent = useCallback(
    () => dropEventMutate({ variables: { input: { id: initialEvent.id } } }),
    [initialEvent, dropEventMutate],
  );

  usePageTitle(`Editing “${initialEvent?.title}”`);

  const donePath =
    convention?.site_mode === 'single_event' ? '/' : (buildEventCategoryUrl(eventCategory) ?? '/admin_events');

  return (
    <EditEvent
      cancelPath={donePath}
      showDropButton={convention?.site_mode !== 'single_event'}
      event={event}
      dropEvent={dropEvent}
      validateForm={validateForm}
      updateEvent={async () => {
        if (eventCategory) {
          return await updateEvent({ event, eventCategory, run });
        }
      }}
      onSave={() => {
        navigate(donePath);
      }}
      onDrop={() => {
        navigate(donePath);
      }}
    >
      <>
        <EventFormWithCategorySelection {...eventFormWithCategorySelectionProps} />
        {currentAbility.can_override_maximum_event_provided_tickets &&
          convention?.ticket_mode !== 'disabled' &&
          convention?.site_mode === 'convention' && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketTypes={convention.ticket_types}
              ticketName={convention.ticket_name}
              overrides={initialEvent.maximum_event_provided_tickets_overrides}
              eventId={initialEvent.id}
            />
          )}

        {eventCategory?.scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
          <RunFormFields convention={convention} run={run} event={eventForRunFormFields} onChange={setRun} />
        )}
      </>
    </EditEvent>
  );
}

export const Component = EventAdminEditEvent;
