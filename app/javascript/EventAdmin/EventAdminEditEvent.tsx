import { useState, useMemo, useCallback } from 'react';
import { LoaderFunction, RouterContextProvider, useLoaderData, useRouteLoaderData, useSubmit } from 'react-router';
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
import { UpdateEventOptions } from './$id';
import { ActiveStorageAttachment, BucketKeyMappingInput } from 'graphqlTypes.generated';
import { useAsyncFetcher } from 'useAsyncFetcher';
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
  const submit = useSubmit();
  const fetcher = useAsyncFetcher();

  const [run, setRun] = useState(initialEvent?.runs[0] || {});
  const [remappingModalVisible, setRemappingModalVisible] = useState(false);
  const [removedBucketsNeedingRemapping, setRemovedBucketsNeedingRemapping] = useState<
    { key: string; name?: string | null }[]
  >([]);

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

  const dropEvent = () => {
    submit({}, { method: 'PATCH', action: `../events/${event.id}/drop`, relative: 'route' });
  };

  const submitEvent = useCallback(
    (bucketKeyMappings?: BucketKeyMappingInput[]) => {
      if (eventCategory) {
        const eventWithMappings = bucketKeyMappings ? { ...event, bucket_key_mappings: bucketKeyMappings } : event;
        submit({ event: eventWithMappings, eventCategory, run } satisfies Omit<UpdateEventOptions, 'client'>, {
          method: 'PATCH',
          encType: 'application/json',
          action: `/admin_events/${eventCategory.id}/events/${event.id}`,
        });
      }
    },
    [event, eventCategory, run, submit],
  );

  const updateEvent = useCallback(() => {
    const currentBuckets: { key: string; name?: string | null }[] =
      (event.form_response_attrs.registration_policy as { buckets?: { key: string; name?: string | null }[] } | null)
        ?.buckets ?? [];
    const currentBucketKeys = new Set(currentBuckets.map((b) => b.key));

    const originalBuckets = initialEvent.registration_policy?.buckets ?? [];
    const keysWithRecords = new Set(initialEvent.bucket_keys_with_pending_signups_or_requests);

    const removedBuckets = originalBuckets.filter((b) => !currentBucketKeys.has(b.key) && keysWithRecords.has(b.key));

    if (removedBuckets.length > 0) {
      setRemovedBucketsNeedingRemapping(removedBuckets);
      setRemappingModalVisible(true);
    } else {
      submitEvent();
    }
  }, [event, initialEvent, submitEvent]);

  usePageTitle(t('admin.events.editPageTitle', { title: initialEvent.title }));

  const donePath = convention?.site_mode === 'single_event' ? '/' : '../..';

  const newPolicyBuckets: { key: string; name?: string | null }[] =
    (event.form_response_attrs.registration_policy as { buckets?: { key: string; name?: string | null }[] } | null)
      ?.buckets ?? [];

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
      <BucketKeyRemappingModal
        visible={remappingModalVisible}
        removedBuckets={removedBucketsNeedingRemapping}
        newPolicyBuckets={newPolicyBuckets}
        onConfirm={(mappings) => {
          setRemappingModalVisible(false);
          submitEvent(mappings);
        }}
        onCancel={() => setRemappingModalVisible(false)}
      />
    </>
  );
}

export const Component = EventAdminEditEvent;
