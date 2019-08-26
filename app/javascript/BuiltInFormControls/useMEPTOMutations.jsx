import { useCallback } from 'react';

export default function useMEPTOMutations({
  createMutate, updateMutate, deleteMutate, createUpdater, deleteUpdater,
}) {
  const createOverride = useCallback(
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

  const updateOverride = useCallback(
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

  const deleteOverride = useCallback(
    (id) => deleteMutate({
      variables: {
        input: {
          id,
        },
      },

      update: (store) => deleteUpdater(store, id),
    }),
    [deleteMutate, deleteUpdater],
  );

  return { createOverride, deleteOverride, updateOverride };
}
