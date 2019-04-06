import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import {
  UpdateEvent,
  DropEvent,
  CreateMaximumEventProvidedTicketsOverride,
  UpdateMaximumEventProvidedTicketsOverride,
  DeleteMaximumEventProvidedTicketsOverride,
} from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import useMutationCallback from '../useMutationCallback';
import useMEPTOEditor from '../BuiltInFormControls/useMEPTOEditor';
import useEventFormWithCategorySelection from './useEventFormWithCategorySelection';
import useEventEditor from '../BuiltInForms/useEventEditor';
import deserializeEvent from './deserializeEvent';

function createUpdater(store, eventId, override) {
  const storeData = store.readQuery({ query: EventAdminEventsQuery });
  const event = storeData.events.find(evt => evt.id === eventId);
  event.maximum_event_provided_tickets_overrides.push(override);
  store.writeQuery({ query: EventAdminEventsQuery, storeData });
}

function deleteUpdater(store, id) {
  const storeData = store.readQuery({ query: EventAdminEventsQuery });
  const event = storeData.events.find((
    evt => evt.maximum_event_provided_tickets_overrides.some((
      override => override.id === id
    ))
  ));
  const newOverrides = event.maximum_event_provided_tickets_overrides
    .filter(override => override.id !== id);
  event.maximum_event_provided_tickets_overrides = newOverrides;
  store.writeQuery({ query: EventAdminEventsQuery, storeData });
}

function EventAdminEditEvent({ match, history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  const renderMEPTOEditor = useMEPTOEditor({
    createMutate: useMutationCallback(CreateMaximumEventProvidedTicketsOverride),
    updateMutate: useMutationCallback(UpdateMaximumEventProvidedTicketsOverride),
    deleteMutate: useMutationCallback(DeleteMaximumEventProvidedTicketsOverride),
    createUpdater,
    deleteUpdater,
  });

  const eventId = match.params.id;
  const initialEvent = useMemo(
    () => (error ? null : deserializeEvent(data.events.find(e => e.id.toString() === eventId))),
    [data.events, error, eventId],
  );

  const {
    event, eventCategoryId, renderForm, validateForm,
  } = useEventFormWithCategorySelection({
    convention: data.convention, initialEvent,
  });

  const updateEventMutate = useMutationCallback(UpdateEvent);
  const updateEvent = useCallback(
    () => updateEventMutate({
      variables: {
        input: {
          id: event.id,
          event: {
            event_category_id: eventCategoryId,
            form_response_attrs_json: JSON.stringify(event.form_response_attrs),
          },
        },
      },
    }),
    [event, updateEventMutate, eventCategoryId],
  );

  const dropEventMutate = useMutationCallback(DropEvent);
  const dropEvent = useCallback(
    () => dropEventMutate({ variables: { input: { id: event.id } } }),
    [event.id, dropEventMutate],
  );

  const renderEditor = useEventEditor({
    event,
    renderForm,
    validateForm,
    updateEvent,
    dropEvent,
    onSave: () => { history.push('/runs'); },
    onDrop: () => { history.push('/runs'); },
  });

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return renderEditor({
    showDropButton: true,
    cancelPath: '/runs',
    children: (
      data.currentAbility.can_override_maximum_event_provided_tickets && renderMEPTOEditor({
        ticketTypes: data.convention.ticket_types,
        ticketName: data.convention.ticket_name,
        overrides: event.maximum_event_provided_tickets_overrides,
        eventId: event.id,
      })
    ),
  });
}

EventAdminEditEvent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EventAdminEditEvent);
