import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import {
  DropEvent,
  CreateMaximumEventProvidedTicketsOverride,
  UpdateMaximumEventProvidedTicketsOverride,
  DeleteMaximumEventProvidedTicketsOverride,
} from './mutations.gql';
import useMEPTOMutations from '../BuiltInFormControls/useMEPTOMutations';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import deserializeEvent from './deserializeEvent';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../usePageTitle';
import useUpdateEvent from './useUpdateEvent';
import RunFormFields from '../BuiltInForms/RunFormFields';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EventAdminEditEventForm({ data }) {
  const history = useHistory();
  const { id: eventId } = useParams();
  const initialEvent = useMemo(
    () => deserializeEvent(data.events.find((e) => e.id.toString() === eventId)),
    [data.events, eventId],
  );

  const meptoMutations = useMEPTOMutations({
    createMutate: useMutation(CreateMaximumEventProvidedTicketsOverride)[0],
    updateMutate: useMutation(UpdateMaximumEventProvidedTicketsOverride)[0],
    deleteMutate: useMutation(DeleteMaximumEventProvidedTicketsOverride)[0],
    createUpdater: (store, updatedEventId, override) => {
      const storeData = store.readQuery({ query: EventAdminEventsQuery });
      store.writeQuery({
        query: EventAdminEventsQuery,
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
      const storeData = store.readQuery({ query: EventAdminEventsQuery });
      store.writeQuery({
        query: EventAdminEventsQuery,
        data: {
          ...storeData,
          events: data.events.map((event) => ({
            ...event,
            maximum_event_provided_tickets_overrides: event
              .maximum_event_provided_tickets_overrides
              .filter((mepto) => mepto.id !== overrideId),
          })),
        },
      });
    },
  });

  const [run, setRun] = useState(initialEvent.runs[0] || {});

  const [eventFormWithCategorySelectionProps, {
    event, eventCategory, validateForm,
  }] = useEventFormWithCategorySelection({
    convention: data.convention, initialEvent,
  });

  const updateEvent = useUpdateEvent();

  const [dropEventMutate] = useMutation(DropEvent);
  const dropEvent = useCallback(
    () => dropEventMutate({ variables: { input: { id: event.id } } }),
    [event.id, dropEventMutate],
  );

  usePageTitle(`Editing “${event.title}”`);

  const donePath = data.convention.site_mode === 'single_event' ? '/' : buildEventCategoryUrl(eventCategory);

  return (
    <EditEvent
      cancelPath={donePath}
      showDropButton={data.convention.site_mode !== 'single_event'}
      event={event}
      dropEvent={dropEvent}
      validateForm={validateForm}
      updateEvent={() => updateEvent({ event, eventCategory, run })}
      onSave={() => { history.push(donePath); }}
      onDrop={() => { history.push(donePath); }}
    >
      <EventFormWithCategorySelection {...eventFormWithCategorySelectionProps}>
        {data.currentAbility.can_override_maximum_event_provided_tickets
          && data.convention.ticket_mode !== 'disabled'
          && data.convention.site_mode === 'convention'
          && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketTypes={data.convention.ticket_types}
              ticketName={data.convention.ticket_name}
              overrides={initialEvent.maximum_event_provided_tickets_overrides}
              eventId={initialEvent.id}
            />
          )}
      </EventFormWithCategorySelection>

      {eventCategory.scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
        <RunFormFields
          run={run}
          event={{ id: event.id, length_seconds: event.form_response_attrs.length_seconds }}
          convention={data.convention}
          onChange={setRun}
        />
      )}
    </EditEvent>
  );
}

EventAdminEditEventForm.propTypes = {
  data: PropTypes.shape({
    currentAbility: PropTypes.shape({
      can_override_maximum_event_provided_tickets: PropTypes.bool.isRequired,
    }).isRequired,
    convention: PropTypes.shape({
      ticket_types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      ticket_name: PropTypes.string.isRequired,
      ticket_mode: PropTypes.string.isRequired,
      site_mode: PropTypes.string.isRequired,
    }).isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
};

function EventAdminEditEvent() {
  const { data, loading, error } = useQuery(EventAdminEventsQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <EventAdminEditEventForm data={data} />;
}

export default EventAdminEditEvent;
