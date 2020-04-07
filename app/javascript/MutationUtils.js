import { useCallback } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { useMutation } from '@apollo/react-hooks';

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

export function deleteUpdater({
  query, queryVariables, arrayPath, idAttribute, id,
}) {
  return (store) => {
    const data = store.readQuery({ query, variables: queryVariables });
    store.writeQuery({
      query,
      variables: queryVariables,
      data: set(
        arrayPath,
        get(arrayPath, data)
          .filter((object) => object[idAttribute || 'id'] !== id),
        data,
      ),
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
  const [mutate] = useMutation(mutation, { update, ...options });
  return mutate;
}

export function useDeleteMutation(mutation, {
  query, variables, arrayPath, idVariablePath, idAttribute, queryVariables, ...options
}) {
  const [mutate] = useMutation(mutation, { variables, ...options });
  return useCallback(
    (mutateOptions) => {
      const mutateVariables = (mutateOptions || {}).variables || variables;
      const id = get(idVariablePath, mutateVariables);
      if (typeof id === 'undefined') {
        throw new Error(`id expected at path ${idVariablePath.join('.')} but undefined found instead`);
      }

      return mutate({
        update: deleteUpdater({
          query, queryVariables, arrayPath, idAttribute, id,
        }),
        ...mutateOptions,
      });
    },
    [arrayPath, idVariablePath, idAttribute, mutate, query, queryVariables, variables],
  );
}
