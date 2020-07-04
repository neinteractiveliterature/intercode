import { useCallback } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { DocumentNode, ExecutionResult } from 'graphql';
import { OperationVariables } from 'apollo-client';
import { DataProxy } from 'apollo-cache';

export function createUpdater<
QueryType extends object,
TVariables extends OperationVariables,
TData
>({
  query, variables, arrayPath, newObjectPath,
}: {
  query: DocumentNode,
  variables?: TVariables,
  arrayPath: string[],
  newObjectPath: string[],
}) {
  return (store: DataProxy, result: ExecutionResult<TData>) => {
    const newObject = get(['data', ...newObjectPath], result);
    const data = store.readQuery<QueryType, TVariables>({ query, variables });
    if (data == null) {
      return;
    }

    const existingObjects = get(arrayPath, data);
    store.writeQuery({
      query,
      variables,
      data: set(arrayPath, [...existingObjects, newObject], data),
    });
  };
}

export function deleteUpdater<
QueryType extends object,
TVariables extends OperationVariables
>({
  query, queryVariables, arrayPath, idAttribute, id,
}: {
  query: DocumentNode,
  queryVariables?: TVariables,
  arrayPath: string[],
  idAttribute?: string,
  id: any,
}) {
  return (store: DataProxy) => {
    const data = store.readQuery<QueryType, TVariables>({ query, variables: queryVariables });
    if (data == null) {
      return;
    }

    store.writeQuery({
      query,
      variables: queryVariables,
      data: set(
        arrayPath,
        get(arrayPath, data)
          .filter((object: any) => object[idAttribute ?? 'id'] !== id),
        data,
      ),
    });
  };
}

export function useCreateMutation<
QueryType extends object,
TVariables extends OperationVariables,
TData
>(mutation: DocumentNode, {
  query, queryVariables: variables, arrayPath, newObjectPath, ...options
}: MutationHookOptions<TData, TVariables> & {
  query: DocumentNode,
  queryVariables?: TVariables,
  arrayPath: string[],
  newObjectPath: string[],
}) {
  const update = useCallback(
    () => createUpdater<QueryType, TVariables, TData>({
      query, variables, arrayPath, newObjectPath,
    }),
    [query, variables, arrayPath, newObjectPath],
  );
  const [mutate] = useMutation(mutation, { update, ...options });
  return mutate;
}

export function useDeleteMutation<
QueryType extends object,
TVariables extends OperationVariables,
TData
>(mutation: DocumentNode, {
  query, variables, arrayPath, idVariablePath, idAttribute, queryVariables, ...options
}: MutationHookOptions<TData, TVariables> & {
  query: DocumentNode,
  arrayPath: string[],
  idVariablePath: string[],
  idAttribute?: string,
  queryVariables?: OperationVariables,
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
