import { useCallback, useMemo } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { useMutation, MutationHookOptions, ApolloCache, OperationVariables } from '@apollo/client';
import { DocumentNode, ExecutionResult } from 'graphql';

export function createUpdater<
  QueryType extends object,
  TVariables extends OperationVariables,
  TData
>({
  query,
  variables,
  arrayPath,
  newObjectPath,
}: {
  query: DocumentNode;
  variables?: TVariables;
  arrayPath: string[];
  newObjectPath: string[];
}) {
  return (store: ApolloCache<any>, result: ExecutionResult<TData>) => {
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

export function deleteUpdater<QueryType extends object, TVariables extends OperationVariables>({
  query,
  queryVariables,
  arrayPath,
  idAttribute,
  id,
}: {
  query: DocumentNode;
  queryVariables?: TVariables;
  arrayPath: string[];
  idAttribute?: string;
  id: any;
}) {
  return (store: ApolloCache<any>) => {
    const data = store.readQuery<QueryType, TVariables>({ query, variables: queryVariables });
    if (data == null) {
      return;
    }

    store.writeQuery({
      query,
      variables: queryVariables,
      data: set(
        arrayPath,
        get(arrayPath, data).filter((object: any) => object[idAttribute ?? 'id'] !== id),
        data,
      ),
    });
  };
}

export function useCreateMutation<
  QueryType extends object,
  QueryVariables extends OperationVariables,
  TVariables extends OperationVariables,
  TData
>(
  mutation: DocumentNode,
  {
    query,
    queryVariables: variables,
    arrayPath,
    newObjectPath,
    ...options
  }: MutationHookOptions<TData, TVariables> & {
    query: DocumentNode;
    queryVariables?: QueryVariables;
    arrayPath: string[];
    newObjectPath: string[];
  },
) {
  const update = useMemo(
    () =>
      createUpdater<QueryType, QueryVariables, TData>({
        query,
        variables,
        arrayPath,
        newObjectPath,
      }),
    [query, variables, arrayPath, newObjectPath],
  );
  const [mutate] = useMutation(mutation, { update, ...options });
  return mutate;
}

export function useDeleteMutation<TVariables extends OperationVariables, TData>(
  mutation: DocumentNode,
  {
    query,
    variables,
    arrayPath,
    idVariablePath,
    idAttribute,
    queryVariables,
    ...options
  }: MutationHookOptions<TData, TVariables> & {
    query: DocumentNode;
    arrayPath: string[];
    idVariablePath: string[];
    idAttribute?: string;
    queryVariables?: OperationVariables;
  },
) {
  const [mutate] = useMutation(mutation, { variables, ...options });
  return useCallback(
    (mutateOptions) => {
      const mutateVariables = (mutateOptions || {}).variables || variables;
      const id = get(idVariablePath, mutateVariables);
      if (typeof id === 'undefined') {
        throw new Error(
          `id expected at path ${idVariablePath.join('.')} but undefined found instead`,
        );
      }

      return mutate({
        update: deleteUpdater({
          query,
          queryVariables,
          arrayPath,
          idAttribute,
          id,
        }),
        ...mutateOptions,
      });
    },
    [arrayPath, idVariablePath, idAttribute, mutate, query, queryVariables, variables],
  );
}
