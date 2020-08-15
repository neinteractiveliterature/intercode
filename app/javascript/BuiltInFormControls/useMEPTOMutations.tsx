import { useCallback } from 'react';
import { ApolloCache } from '@apollo/client';
import { MEPTOEditorProps } from './MaximumEventProvidedTicketsOverrideEditor';

export type UseMEPTOMutationsProps<OverrideType> = {
  createMutate: (options: {
    variables: {
      input: {
        event_id: number;
        ticket_type_id: number;
        override_value: number;
      };
    };

    update: (
      store: ApolloCache<any>,
      result: {
        data: {
          createMaximumEventProvidedTicketsOverride: {
            maximum_event_provided_tickets_override: OverrideType;
          };
        };
      },
    ) => void;
  }) => Promise<any>;

  updateMutate: (options: {
    variables: {
      input: {
        id: number;
        override_value: number;
      };
    };
  }) => Promise<any>;

  deleteMutate: (options: {
    variables: {
      input: {
        id: number;
      };
    };
    update: (store: ApolloCache<any>) => void;
  }) => Promise<any>;

  createUpdater: (store: ApolloCache<any>, eventId: number, override: OverrideType) => void;
  deleteUpdater: (store: ApolloCache<any>, id: number) => void;
};

export type MEPTOMutations = Pick<
  MEPTOEditorProps,
  'createOverride' | 'updateOverride' | 'deleteOverride'
>;

export default function useMEPTOMutations<OverrideType>({
  createMutate,
  updateMutate,
  deleteMutate,
  createUpdater,
  deleteUpdater,
}: UseMEPTOMutationsProps<OverrideType>): MEPTOMutations {
  const createOverride: MEPTOMutations['createOverride'] = useCallback(
    ({ eventId, ticketTypeId, overrideValue }) =>
      createMutate({
        variables: {
          input: {
            event_id: eventId,
            ticket_type_id: ticketTypeId,
            override_value: overrideValue,
          },
        },

        update: (
          store,
          {
            data: {
              createMaximumEventProvidedTicketsOverride: {
                maximum_event_provided_tickets_override: override,
              },
            },
          },
        ) => createUpdater(store, eventId, override),
      }),
    [createMutate, createUpdater],
  );

  const updateOverride: MEPTOMutations['updateOverride'] = useCallback(
    ({ id, overrideValue }: { id: number; overrideValue: number }) =>
      updateMutate({
        variables: {
          input: {
            id,
            override_value: overrideValue,
          },
        },
      }),
    [updateMutate],
  );

  const deleteOverride: MEPTOMutations['deleteOverride'] = useCallback(
    (id: number) =>
      deleteMutate({
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
