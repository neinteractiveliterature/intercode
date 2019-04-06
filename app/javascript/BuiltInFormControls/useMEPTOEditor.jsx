import React, { useCallback } from 'react';

import MaximumEventProvidedTicketsOverrideEditor from './MaximumEventProvidedTicketsOverrideEditor';

export default function useMEPTOEditor({
  createMutate, updateMutate, deleteMutate, createUpdater, deleteUpdater,
}) {
  const createMEPTO = useCallback(
    ({ eventId, ticketTypeId, overrideValue }) => createMutate({
      variables: {
        input: {
          event_id: eventId,
          ticket_type_id: ticketTypeId,
          override_value: overrideValue,
        },
      },

      update: (store, {
        data: {
          createMaximumEventProvidedTicketsOverride: {
            maximum_event_provided_tickets_override: override,
          },
        },
      }) => createUpdater(store, eventId, override),
    }),
    [createMutate, createUpdater],
  );

  const updateMEPTO = useCallback(
    ({ id, overrideValue }) => updateMutate({
      variables: {
        input: {
          id,
          override_value: overrideValue,
        },
      },
    }),
    [updateMutate],
  );

  const deleteMEPTO = useCallback(
    id => deleteMutate({
      variables: {
        input: {
          id,
        },
      },

      update: store => deleteUpdater(store, id),
    }),
    [deleteMutate, deleteUpdater],
  );

  const renderMEPTOEditor = useCallback(
    props => (
      <MaximumEventProvidedTicketsOverrideEditor
        createOverride={createMEPTO}
        deleteOverride={deleteMEPTO}
        updateOverride={updateMEPTO}
        {...props}
      />
    ),
    [createMEPTO, deleteMEPTO, updateMEPTO],
  );

  return renderMEPTOEditor;
}
