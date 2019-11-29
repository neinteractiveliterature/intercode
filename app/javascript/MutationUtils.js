import { useCallback } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { useMutation } from 'react-apollo-hooks';

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
      return mutate({
        update: (store) => {
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
        },
        ...mutateOptions,
      });
    },
    [arrayPath, idVariablePath, idAttribute, mutate, query, queryVariables, variables],
  );
}
