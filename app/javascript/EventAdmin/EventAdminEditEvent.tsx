import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import useMEPTOMutations from '../BuiltInFormControls/useMEPTOMutations';
import useEventFormWithCategorySelection, {
  EventFormWithCategorySelection,
} from './useEventFormWithCategorySelection';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../usePageTitle';
import useUpdateEvent from './useUpdateEvent';
import RunFormFields from '../BuiltInForms/RunFormFields';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import PageLoadingIndicator from '../PageLoadingIndicator';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';
import {
  EventAdminEventsQueryDocument,
  EventAdminEventsQueryQuery,
  useEventAdminEventsQueryQuery,
} from './queries.generated';
import {
  useDropEventMutation,
  useCreateMaximumEventProvidedTicketsOverrideMutation,
  useUpdateMaximumEventProvidedTicketsOverrideMutation,
  useDeleteMaximumEventProvidedTicketsOverrideMutation,
} from './mutations.generated';

type EventAdminEditEventFormProps = {
  data: EventAdminEventsQueryQuery;
  initialEvent: WithFormResponse<EventAdminEventsQueryQuery['events'][0]>;
};

function EventAdminEditEventForm({ data, initialEvent }: EventAdminEditEventFormProps) {
  const history = useHistory();

  const meptoMutations = useMEPTOMutations({
    createMutate: useCreateMaximumEventProvidedTicketsOverrideMutation()[0],
    updateMutate: useUpdateMaximumEventProvidedTicketsOverrideMutation()[0],
    deleteMutate: useDeleteMaximumEventProvidedTicketsOverrideMutation()[0],
    createUpdater: (store, updatedEventId, override) => {
      const storeData = store.readQuery<EventAdminEventsQueryQuery>({
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
      const storeData = store.readQuery<EventAdminEventsQueryQuery>({
        query: EventAdminEventsQueryDocument,
      });
      store.writeQuery({
        query: EventAdminEventsQueryDocument,
        data: {
          ...storeData,
          events: data.events.map((event) => ({
            ...event,
            maximum_event_provided_tickets_overrides: event.maximum_event_provided_tickets_overrides.filter(
              (mepto) => mepto.id !== overrideId,
            ),
          })),
        },
      });
    },
  });

  const [run, setRun] = useState(initialEvent?.runs[0] || {});

  const [
    eventFormWithCategorySelectionProps,
    { event, eventCategory, validateForm },
  ] = useEventFormWithCategorySelection({
    convention: data.convention!,
    initialEvent,
  });

  const updateEvent = useUpdateEvent();

  const [dropEventMutate] = useDropEventMutation();
  const dropEvent = useCallback(
    () => dropEventMutate({ variables: { input: { id: initialEvent!.id } } }),
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
      updateEvent={() => updateEvent({ event, eventCategory, run })}
      onSave={() => {
        history.push(donePath);
      }}
      onDrop={() => {
        history.push(donePath);
      }}
    >
      <EventFormWithCategorySelection {...eventFormWithCategorySelectionProps}>
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
      </EventFormWithCategorySelection>

      {eventCategory?.scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
        <RunFormFields
          run={run}
          event={{
            id: event.id,
            length_seconds: event.form_response_attrs.length_seconds,
            can_play_concurrently: false,
            event_category: {
              id: 0,
              name: 'fake category for single-run event UI',
            },
            maximum_event_provided_tickets_overrides: [],
            runs: [run],
          }}
          onChange={setRun}
        />
      )}
    </EditEvent>
  );
}

function EventAdminEditEvent() {
  const { data, loading, error } = useEventAdminEventsQueryQuery();
  const { id: eventId } = useParams<{ id: string }>();
  const serializedEvent = useMemo(
    () => (data ? data.events.find((e) => e.id.toString() === eventId) : undefined),
    [data, eventId],
  );
  const initialEvent = useMemo(
    () => (serializedEvent ? deserializeFormResponse(serializedEvent) : undefined),
    [serializedEvent],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <EventAdminEditEventForm data={data!} initialEvent={initialEvent!} />;
}

export default EventAdminEditEvent;
