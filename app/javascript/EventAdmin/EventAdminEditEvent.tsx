import { useState, useMemo, useCallback } from 'react';
import { LoaderFunction, RouterContextProvider, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';

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
import { useImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';
import { NamedRoute } from '../AppRouter';
import { apolloClientContext } from 'AppContexts';
import { updateEvent as updateEventMutation, UpdateEventOptions } from './$id';
import { ActiveStorageAttachment, BucketKeyMappingInput } from 'graphqlTypes.generated';
import { useApolloClient } from '@apollo/client/react';
import { useAsyncFetcher } from 'useAsyncFetcher';
import useBucketKeyRemapping from './useBucketKeyRemapping';
import BucketKeyRemappingModal from './BucketKeyRemappingModal';

type LoaderResult = WithFormResponse<EventAdminSingleEventQueryData['conventionByRequestHost']['event']>;

export const loader: LoaderFunction<RouterContextProvider> = async ({ context, params: { eventId } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: EventAdminSingleEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  if (!data) {
    return new Response(null, { status: 404 });
  }
  const serializedEvent = data.conventionByRequestHost.event;
  const initialEvent = deserializeFormResponse(serializedEvent);
  return initialEvent satisfies LoaderResult;
};

function EventAdminEditEvent() {
  const { t } = useTranslation();
  const { convention, currentAbility } = useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
  const initialEvent = useLoaderData() as LoaderResult;
  const navigate = useNavigate();
  const client = useApolloClient();
  const fetcher = useAsyncFetcher();

  const [run, setRun] = useState(initialEvent?.runs[0] || {});

  const imageAttachmentConfig = useImageAttachmentConfig(initialEvent.images, async (blob) => {
    const data = await fetcher.submitAsync<ActiveStorageAttachment>(
      { signed_blob_id: blob.signed_id },
      { action: `/events/${initialEvent.id}/attach_image`, method: 'POST' },
    );
    return data;
  });

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
      bucket_keys_with_pending_signups_or_requests: [],
      runs: [run],
      images: event.images,
    }),
    [run, event],
  );

  const donePath = convention?.site_mode === 'single_event' ? '/' : '../..';

  const dropEvent = () => {
    fetcher.submit({}, { method: 'PATCH', action: `../events/${event.id}/drop`, relative: 'route' });
  };

  const submitEvent = useCallback(
    async (bucketKeyMappings?: BucketKeyMappingInput[]) => {
      if (eventCategory) {
        const eventWithMappings = bucketKeyMappings ? { ...event, bucket_key_mappings: bucketKeyMappings } : event;
        await updateEventMutation({
          event: eventWithMappings as UpdateEventOptions['event'],
          eventCategory,
          run: run as UpdateEventOptions['run'],
          client,
        });
        navigate(donePath);
      }
    },
    [event, eventCategory, run, client, navigate, donePath],
  );

  const { updateEvent, remappingModalProps } = useBucketKeyRemapping({ event, initialEvent, onSubmit: submitEvent });

  usePageTitle(t('admin.events.editPageTitle', { title: initialEvent.title }));

  return (
    <>
      <EditEvent
        cancelPath={donePath}
        showDropButton={convention?.site_mode !== 'single_event'}
        event={event}
        dropEvent={dropEvent}
        validateForm={validateForm}
        updateEvent={updateEvent}
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
      <BucketKeyRemappingModal {...remappingModalProps} />
    </>
  );
}

export const Component = EventAdminEditEvent;
