import { useCallback } from 'react';
import { ApolloCache, MutationUpdaterFn } from '@apollo/client';
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

    update: MutationUpdaterFn<{
      __typename: string;
      createMaximumEventProvidedTicketsOverride: {
        __typename: string;
        maximum_event_provided_tickets_override: OverrideType;
      };
    }>;
  }) => Promise<unknown>;

  updateMutate: (options: {
    variables: {
      input: {
        id: number;
        override_value: number;
      };
    };
  }) => Promise<unknown>;

  deleteMutate: (options: {
    variables: {
      input: {
        id: number;
      };
    };
    update: (store: ApolloCache<unknown>) => void;
  }) => Promise<unknown>;

  createUpdater: (store: ApolloCache<unknown>, eventId: number, override: OverrideType) => void;
  deleteUpdater: (store: ApolloCache<unknown>, id: number) => void;
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

        update: (store, { data }) => {
          if (data) {
            createUpdater(
              store,
              eventId,
              data.createMaximumEventProvidedTicketsOverride
                .maximum_event_provided_tickets_override,
            );
          }
        },
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
