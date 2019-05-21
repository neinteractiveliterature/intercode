import { useCallback } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';

import useMutationCallback from './useMutationCallback';

export function createUpdater({
  query, variables, arrayPath, newObjectPath,
}) {
  return (store, result) => {
    const newObject = get(['data', ...newObjectPath], result);
    const data = store.readQuery({ query, variables });
    const existingObjects = get(arrayPath, data);
    store.writeQuery({
      query,
      variables,
      data: set(arrayPath, [...existingObjects, newObject], data),
    });
  };
}

export function useCreateMutation(mutation, {
  query, queryVariables: variables, arrayPath, newObjectPath, ...options
}) {
  const update = useCallback(
    createUpdater({
      query, variables, arrayPath, newObjectPath,
    }),
    [query, variables, arrayPath, newObjectPath],
  );

  return useMutationCallback(mutation, { update, ...options });
}

export function useDeleteMutation(mutation, {
  query, variables, arrayPath, idVariablePath, queryVariables, ...options
}) {
  const mutate = useMutationCallback(mutation, { variables, ...options });
  return useCallback(
    (mutateOptions) => {
      const mutateVariables = (mutateOptions || {}).variables || variables;
      const id = get(idVariablePath, mutateVariables);
      return mutate({
        update: (store) => {
          const data = store.readQuery({ query, variables: queryVariables });
          store.writeQuery({
            query,
            variables: queryVariables,
            data: set(arrayPath, get(arrayPath, data).filter(object => object.id !== id), data),
          });
        },
        ...mutateOptions,
      });
    },
    [arrayPath, idVariablePath, mutate, query, queryVariables, variables],
  );
}
