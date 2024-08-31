import { useState, useCallback, useMemo } from 'react';
import { LoaderFunction, useFetcher, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';

import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../usePageTitle';
import RunFormFields, { RunFormFieldsProps } from '../BuiltInForms/RunFormFields';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';
import {
  EventAdminEventsQueryData,
  EventAdminSingleEventQueryData,
  EventAdminSingleEventQueryDocument,
} from './queries.generated';
import { ImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';
import { updateEvent } from './updateEvent';
import { NamedRoute } from '../AppRouter';
import { client } from '../useIntercodeApolloClient';

type LoaderResult = WithFormResponse<EventAdminSingleEventQueryData['conventionByRequestHost']['event']>;

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const {
    data: {
      conventionByRequestHost: { event: serializedEvent },
    },
  } = await client.query({
    query: EventAdminSingleEventQueryDocument,
    variables: { eventId: id ?? '' },
  });
  const initialEvent = deserializeFormResponse(serializedEvent);
  return initialEvent satisfies LoaderResult;
};

function EventAdminEditEvent() {
  const { convention, currentAbility } = useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
  const initialEvent = useLoaderData() as LoaderResult;
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [run, setRun] = useState(initialEvent?.runs[0] || {});
  const [attachImageToEvent] = useAttachImageToEventMutation();

  const imageAttachmentConfig = useMemo<ImageAttachmentConfig>(
    () => ({
      addBlob: (blob) => attachImageToEvent({ variables: { id: initialEvent.id, signedBlobId: blob.signed_id } }),
      existingImages: initialEvent.images,
    }),
    [attachImageToEvent, initialEvent.id, initialEvent.images],
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

  const dropEvent = () => {
    fetcher.submit({}, { method: 'PATCH', action: `/events/${initialEvent.id}/drop` });
  };

  usePageTitle(`Editing “${initialEvent.title}”`);

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
