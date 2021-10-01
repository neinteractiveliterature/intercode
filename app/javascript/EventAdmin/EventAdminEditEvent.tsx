import { useState, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import useMEPTOMutations from '../BuiltInFormControls/useMEPTOMutations';
import useEventFormWithCategorySelection, {
  EventFormWithCategorySelection,
} from './useEventFormWithCategorySelection';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../usePageTitle';
import useUpdateEvent from './useUpdateEvent';
import RunFormFields, { RunFormFieldsProps } from '../BuiltInForms/RunFormFields';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import deserializeFormResponse from '../Models/deserializeFormResponse';
import {
  EventAdminEventsQueryDocument,
  EventAdminEventsQueryData,
  useEventAdminEventsQuery,
} from './queries.generated';
import {
  useDropEventMutation,
  useCreateMaximumEventProvidedTicketsOverrideMutation,
  useUpdateMaximumEventProvidedTicketsOverrideMutation,
  useDeleteMaximumEventProvidedTicketsOverrideMutation,
} from './mutations.generated';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { parseIntOrNull } from '@neinteractiveliterature/litform/lib/ValueUtils';

export default LoadSingleValueFromCollectionWrapper(
  useEventAdminEventsQuery,
  (data, id) => data.events.find((e) => e.id.toString() === id),
  function EventAdminEditEventForm({ data, value: serializedEvent }) {
    const history = useHistory();
    const initialEvent = useMemo(() => deserializeFormResponse(serializedEvent), [serializedEvent]);

    const meptoMutations = useMEPTOMutations({
      createMutate: useCreateMaximumEventProvidedTicketsOverrideMutation()[0],
      updateMutate: useUpdateMaximumEventProvidedTicketsOverrideMutation()[0],
      deleteMutate: useDeleteMaximumEventProvidedTicketsOverrideMutation()[0],
      createUpdater: (store, updatedEventId, override) => {
        const storeData = store.readQuery<EventAdminEventsQueryData>({
          query: EventAdminEventsQueryDocument,
        });
        store.writeQuery({
          query: EventAdminEventsQueryDocument,
          data: {
            ...storeData,
            events: data.events.map((event) => {
              if (event.id !== updatedEventId) {
                return event;
              }

              return {
                ...event,
                maximum_event_provided_tickets_overrides: [
                  ...event.maximum_event_provided_tickets_overrides,
                  override,
                ],
              };
            }),
          },
        });
      },
      deleteUpdater: (store, overrideId) => {
        const storeData = store.readQuery<EventAdminEventsQueryData>({
          query: EventAdminEventsQueryDocument,
        });
        store.writeQuery({
          query: EventAdminEventsQueryDocument,
          data: {
            ...storeData,
            events: data.events.map((event) => ({
              ...event,
              maximum_event_provided_tickets_overrides:
                event.maximum_event_provided_tickets_overrides.filter(
                  (mepto) => mepto.id !== overrideId,
                ),
            })),
          },
        });
      },
    });

    const [run, setRun] = useState(initialEvent?.runs[0] || {});

    const [eventFormWithCategorySelectionProps, { event, eventCategory, validateForm }] =
      useEventFormWithCategorySelection({
        convention: data.convention,
        initialEvent,
      });

    const eventForRunFormFields: RunFormFieldsProps<typeof run>['event'] = useMemo(
      () => ({
        __typename: 'Event',
        id: event.id,
        length_seconds:
          typeof event.form_response_attrs.length_seconds === 'number'
            ? event.form_response_attrs.length_seconds
            : 0,
        current_user_form_item_viewer_role: event.current_user_form_item_viewer_role,
        current_user_form_item_writer_role: event.current_user_form_item_writer_role,
        can_play_concurrently: false,
        event_category: {
          __typename: 'EventCategory',
          id: 0,
          name: 'fake category for single-run event UI',
        },
        maximum_event_provided_tickets_overrides: [],
        runs: [run],
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
      data.convention?.site_mode === 'single_event'
        ? '/'
        : buildEventCategoryUrl(eventCategory) ?? '/admin_events';

    return (
      <EditEvent
        cancelPath={donePath}
        showDropButton={data.convention?.site_mode !== 'single_event'}
        event={event}
        dropEvent={dropEvent}
        validateForm={validateForm}
        updateEvent={async () => {
          if (eventCategory) {
            return await updateEvent({ event, eventCategory, run });
          }
        }}
        onSave={() => {
          history.push(donePath);
        }}
        onDrop={() => {
          history.push(donePath);
        }}
      >
        <EventFormWithCategorySelection {...eventFormWithCategorySelectionProps} />
        {data.currentAbility.can_override_maximum_event_provided_tickets &&
          data.convention?.ticket_mode !== 'disabled' &&
          data.convention?.site_mode === 'convention' && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketTypes={data.convention.ticket_types}
              ticketName={data.convention.ticket_name}
              overrides={initialEvent.maximum_event_provided_tickets_overrides}
              eventId={initialEvent.id}
            />
          )}

        {eventCategory?.scheduling_ui === 'single_run' &&
          event.form_response_attrs.length_seconds && (
            <RunFormFields run={run} event={eventForRunFormFields} onChange={setRun} />
          )}
      </EditEvent>
    );
  },
);
