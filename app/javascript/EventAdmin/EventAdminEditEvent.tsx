import { useState, useMemo } from 'react';
import { LoaderFunction, useFetcher, useLoaderData, useRouteLoaderData, useSubmit } from 'react-router-dom';

import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../usePageTitle';
import RunFormFields, { RunFormFieldsProps } from '../BuiltInForms/RunFormFields';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';
import {
  EventAdminEventsQueryData,
  EventAdminSingleEventQueryData,
  EventAdminSingleEventQueryDocument,
} from './queries.generated';
import { ImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';
import { NamedRoute } from '../appRoutes';
import { client } from '../useIntercodeApolloClient';
import { UpdateEventOptions } from './$id';

type LoaderResult = WithFormResponse<EventAdminSingleEventQueryData['conventionByRequestHost']['event']>;

export const loader: LoaderFunction = async ({ params: { eventId } }) => {
  const {
    data: {
      conventionByRequestHost: { event: serializedEvent },
    },
  } = await client.query({
    query: EventAdminSingleEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  const initialEvent = deserializeFormResponse(serializedEvent);
  return initialEvent satisfies LoaderResult;
};

function EventAdminEditEvent() {
  const { convention, currentAbility } = useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
  const initialEvent = useLoaderData() as LoaderResult;
  const submit = useSubmit();
  const fetcher = useFetcher();

  const [run, setRun] = useState(initialEvent?.runs[0] || {});

  const imageAttachmentConfig = useMemo<ImageAttachmentConfig>(
    () => ({
      addBlob: (blob) =>
        fetcher.submit(
          { signed_blob_id: blob.signed_id },
          { action: `/events/${initialEvent.id}/attach_image`, method: 'POST' },
        ),
      existingImages: initialEvent.images,
    }),
    [fetcher, initialEvent.images, initialEvent.id],
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
    submit({}, { method: 'PATCH', action: `../events/${event.id}/drop`, relative: 'route' });
  };

  usePageTitle(`Editing “${initialEvent.title}”`);

  const donePath = convention?.site_mode === 'single_event' ? '/' : '../..';

  return (
    <EditEvent
      cancelPath={donePath}
      showDropButton={convention?.site_mode !== 'single_event'}
      event={event}
      dropEvent={dropEvent}
      validateForm={validateForm}
      updateEvent={() => {
        if (eventCategory) {
          submit({ event, eventCategory, run } satisfies UpdateEventOptions, {
            method: 'PATCH',
            encType: 'application/json',
            action: `/admin_events/${eventCategory.id}/events/${event.id}`,
          });
        }
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
