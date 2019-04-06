import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import deserializeEvent from '../../EventAdmin/deserializeEvent';
import { deserializeForm } from '../../FormPresenter/GraphQLFormDeserialization';
import ErrorDisplay from '../../ErrorDisplay';
import { StandaloneEditEventQuery } from './queries.gql';
import {
  StandaloneDropEvent,
  StandaloneUpdateEvent,
  StandaloneCreateMaximumEventProvidedTicketsOverride,
  StandaloneDeleteMaximumEventProvidedTicketsOverride,
  StandaloneUpdateMaximumEventProvidedTicketsOverride,
} from './mutations.gql';
import useQuerySuspended from '../../useQuerySuspended';
import useMutationCallback from '../../useMutationCallback';
import useMEPTOEditor from '../../BuiltInFormControls/useMEPTOEditor';
import useEventForm from '../../EventAdmin/useEventForm';
import useEventEditor from '../../BuiltInForms/useEventEditor';

function StandaloneEditEvent({ eventId, eventPath, history }) {
  const queryOptions = { variables: { eventId } };
  const { data, error } = useQuerySuspended(StandaloneEditEventQuery, queryOptions);

  const initialEvent = deserializeEvent(data.event);

  const {
    event, renderForm, validateForm,
  } = useEventForm({
    convention: data.convention,
    initialEvent,
    eventForm: deserializeForm(data.event.event_category.event_form),
  });

  const updateEventMutate = useMutationCallback(StandaloneUpdateEvent);
  const updateEvent = useCallback(
    () => updateEventMutate({
      variables: {
        input: {
          id: event.id,
          event: {
            form_response_attrs_json: JSON.stringify(event.form_response_attrs),
          },
        },
      },
    }),
    [event, updateEventMutate],
  );

  const dropEventMutate = useMutationCallback(StandaloneDropEvent);
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
    onSave: () => { history.push(eventPath); },
    onDrop: () => { history.push('/'); },
  });

  const renderMEPTOEditor = useMEPTOEditor({
    createMutate: useMutationCallback(StandaloneCreateMaximumEventProvidedTicketsOverride),
    updateMutate: useMutationCallback(StandaloneUpdateMaximumEventProvidedTicketsOverride),
    deleteMutate: useMutationCallback(StandaloneDeleteMaximumEventProvidedTicketsOverride),
    createUpdater: useCallback(
      (store, updatedEventId, override) => {
        const storeData = store.readQuery({
          query: StandaloneEditEventQuery,
          ...queryOptions,
        });
        storeData.event.maximum_event_provided_tickets_overrides.push(override);
        store.writeQuery({ query: StandaloneEditEventQuery, ...queryOptions, data: storeData });
      },
      [queryOptions],
    ),
    deleteUpdater: useCallback(
      (store, id) => {
        const storeData = store.readQuery({
          query: StandaloneEditEventQuery,
          ...queryOptions,
        });
        const newOverrides = storeData.event.maximum_event_provided_tickets_overrides
          .filter(override => override.id !== id);
        storeData.event.maximum_event_provided_tickets_overrides = newOverrides;
        store.writeQuery({ query: StandaloneEditEventQuery, ...queryOptions, data: storeData });
      },
      [queryOptions],
    ),
  });

  useEffect(
    () => {
      if (error) {
        return;
      }

      window.document.title = `Edit ${data.event.title} - ${data.convention.name}`;
    },
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return renderEditor({
    showDropButton: data.currentAbility.can_delete_event,
    cancelPath: eventPath,
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

StandaloneEditEvent.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default withRouter(StandaloneEditEvent);
