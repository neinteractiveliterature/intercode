import { useCallback } from 'react';
import { MEPTOEditorProps } from './MaximumEventProvidedTicketsOverrideEditor';

export type UseMEPTOMutationsProps = {
  createMutate: (options: {
    variables: {
      input: {
        eventId: string;
        ticketTypeId: string;
        override_value: number;
      };
    };
  }) => Promise<unknown>;

  updateMutate: (options: {
    variables: {
      input: {
        id: string;
        override_value: number;
      };
    };
  }) => Promise<unknown>;

  deleteMutate: (mepto: Parameters<MEPTOMutations['deleteOverride']>[0]) => Promise<unknown>;
};

export type MEPTOMutations = Pick<MEPTOEditorProps, 'createOverride' | 'updateOverride' | 'deleteOverride'>;

export default function useMEPTOMutations({
  createMutate,
  updateMutate,
  deleteMutate,
}: UseMEPTOMutationsProps): MEPTOMutations {
  const createOverride: MEPTOMutations['createOverride'] = useCallback(
    ({ eventId, ticketTypeId, overrideValue }) =>
      createMutate({
        variables: {
          input: {
            eventId,
            ticketTypeId,
            override_value: overrideValue,
          },
        },
      }),
    [createMutate],
  );

  const updateOverride: MEPTOMutations['updateOverride'] = useCallback(
    ({ id, overrideValue }: { id: string; overrideValue: number }) =>
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

  const deleteOverride: MEPTOMutations['deleteOverride'] = useCallback((mepto) => deleteMutate(mepto), [deleteMutate]);

  return { createOverride, deleteOverride, updateOverride };
}
