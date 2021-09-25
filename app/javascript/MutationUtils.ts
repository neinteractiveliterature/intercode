import { useCallback, useMemo } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import {
  // eslint-disable-next-line no-restricted-imports
  useMutation,
  MutationHookOptions,
  ApolloCache,
  OperationVariables,
  MutationTuple,
} from '@apollo/client';
import { DocumentNode, ExecutionResult } from 'graphql';

export function createUpdater<QueryType, TVariables extends OperationVariables, TData>({
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
  return (store: ApolloCache<unknown>, result: ExecutionResult<TData>): void => {
    const newObject = get(['data', ...newObjectPath], result);
    if (newObject == null) {
      throw new Error(
        `MutationUtils.createUpdater: Expected an object in mutation response at path ${newObjectPath.join(
          '.',
        )}, but none was found`,
      );
    }
    const data = store.readQuery<QueryType, TVariables>({ query, variables });
    if (data == null) {
      return;
    }

    const existingObjects = get(arrayPath, data);
    store.writeQuery({
      query,
      variables,
      // eslint-disable-next-line @typescript-eslint/ban-types
      data: set(arrayPath, [...existingObjects, newObject], data as unknown as object),
    });
  };
}

export function deleteUpdater<QueryType, TVariables extends OperationVariables>({
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
  id: unknown;
}) {
  return (store: ApolloCache<unknown>): void => {
    const data = store.readQuery<QueryType, TVariables>({ query, variables: queryVariables });
    if (data == null) {
      return;
    }

    store.writeQuery({
      query,
      variables: queryVariables,
      data: set(
        arrayPath,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get(arrayPath, data).filter((object: any) => object[idAttribute ?? 'id'] !== id),
        // eslint-disable-next-line @typescript-eslint/ban-types
        data as unknown as object,
      ),
    });
  };
}

export function useCreateMutation<
  QueryType,
  QueryVariables extends OperationVariables,
  TVariables extends OperationVariables,
  TData,
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
): MutationTuple<TData, TVariables>[0] {
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
): MutationTuple<TData, TVariables>[0] {
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
