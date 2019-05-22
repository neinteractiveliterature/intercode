import React, { useState, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import {
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
import useUpdateEvent from './useUpdateEvent';
import RunFormFields from '../BuiltInForms/RunFormFields';

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

  const [run, setRun] = useState(initialEvent.runs[0] || {});

  const [eventFormWithCategorySelectionProps, {
    event, eventCategory, validateForm,
  }] = useEventFormWithCategorySelection({
    convention: data.convention, initialEvent,
  });

  const updateEvent = useUpdateEvent();

  const dropEventMutate = useMutationCallback(DropEvent);
  const dropEvent = useCallback(
    () => dropEventMutate({ variables: { input: { id: event.id } } }),
    [event.id, dropEventMutate],
  );

  usePageTitle(useValueUnless(() => `Editing “${event.title}”`, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const donePath = data.convention.site_mode === 'single_event' ? '/' : '/admin_events/runs';

  return (
    <EditEvent
      cancelPath={donePath}
      showDropButton
      event={event}
      dropEvent={dropEvent}
      validateForm={validateForm}
      updateEvent={() => updateEvent({ event, run })}
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
              overrides={event.maximum_event_provided_tickets_overrides}
              eventId={event.id}
            />
          )}
      </EventFormWithCategorySelection>

      {eventCategory.scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
        <RunFormFields
          run={run}
          event={{ length_seconds: event.form_response_attrs.length_seconds }}
          convention={data.convention}
          onChange={setRun}
        />
      )}
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
