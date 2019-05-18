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
import useMEPTOMutations from '../BuiltInFormControls/useMEPTOMutations';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import deserializeEvent from './deserializeEvent';
import EditEvent from '../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import useValueUnless from '../useValueUnless';
import usePageTitle from '../usePageTitle';

function EventAdminEditEvent({ match, history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const meptoMutations = useMEPTOMutations({
    createMutate: useMutationCallback(CreateMaximumEventProvidedTicketsOverride),
    updateMutate: useMutationCallback(UpdateMaximumEventProvidedTicketsOverride),
    deleteMutate: useMutationCallback(DeleteMaximumEventProvidedTicketsOverride),
  });

  const eventId = match.params.id;
  const initialEvent = useMemo(
    () => (error ? null : deserializeEvent(data.events.find(e => e.id.toString() === eventId))),
    [data.events, error, eventId],
  );

  const [eventFormProps, {
    event, eventCategoryId, validateForm,
  }] = useEventFormWithCategorySelection({
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

  usePageTitle(useValueUnless(() => `Editing “${event.title}”`, error), useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditEvent
      cancelPath="/admin_events/runs"
      showDropButton
      event={event}
      dropEvent={dropEvent}
      validateForm={validateForm}
      updateEvent={updateEvent}
      onSave={() => { history.push('/admin_events/runs'); }}
      onDrop={() => { history.push('/admin_events/runs'); }}
    >
      <EventFormWithCategorySelection {...eventFormProps}>
        {data.currentAbility.can_override_maximum_event_provided_tickets
          && data.convention.ticket_mode !== 'disabled'
          && (
            <MaximumEventProvidedTicketsOverrideEditor
              {...meptoMutations}
              ticketTypes={data.convention.ticket_types}
              ticketName={data.convention.ticket_name}
              overrides={event.maximum_event_provided_tickets_overrides}
              eventId={event.id}
            />
          )}
      </EventFormWithCategorySelection>
    </EditEvent>
  );
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
