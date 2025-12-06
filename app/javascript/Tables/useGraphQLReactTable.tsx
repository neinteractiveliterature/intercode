import { useMemo } from 'react';
import { OperationVariables, TypedDocumentNode } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

import { reactTableFiltersToTableResultsFilters, reactTableSortToTableResultsSort } from './TableUtils';
import useCachedLoadableValue from '../useCachedLoadableValue';
import { SortInput } from '../graphqlTypes.generated';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

export type GraphQLReactTableVariables = {
  page?: number | null;
  perPage?: number | null;
  filters?: { [field: string]: unknown } | null;
  sort?: SortInput | SortInput[] | null;
};

function queryResultHasData<QueryData, Variables extends OperationVariables>(
  queryResult: useQuery.Result<QueryData, Variables>,
): queryResult is useQuery.Result<QueryData, Variables, 'complete'> {
  return queryResult.data != null;
}

export type UseGraphQLReactTableOptions<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = {
  getData: (queryData: useQuery.Result<QueryData, Variables, 'complete'>) => RowType[];
  getPages: (queryData: useQuery.Result<QueryData, Variables, 'complete'>) => number;
  query: TypedDocumentNode<QueryData, Variables>;
  variables?: Variables;
  filters?: ColumnFiltersState;
  sortBy?: SortingState;
  page?: number;
  pageSize?: number;
};

export type UseGraphQLReactTableResult<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = {
  data: RowType[];
  pages: number;
  refetch: useQuery.Result<QueryData, Variables, 'complete' | 'empty'>['refetch'];
  loading: boolean;
  error?: Error;
  queryData: useQuery.Result<QueryData, Variables, 'complete' | 'empty'>['data'];
};

export default function useGraphQLReactTable<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
>({
  getData,
  getPages,
  query,
  variables,
  filters,
  sortBy,
  page,
  pageSize,
}: UseGraphQLReactTableOptions<RowType, QueryData, Variables>): UseGraphQLReactTableResult<
  RowType,
  QueryData,
  Variables
> {
  const effectiveVariables = useMemo(
    () => ({
      ...(variables as Variables),
      page: (page ?? 0) + 1,
      perPage: pageSize,
      filters: reactTableFiltersToTableResultsFilters(filters),
      sort: reactTableSortToTableResultsSort(sortBy),
    }),
    [variables, page, pageSize, sortBy, filters],
  );
  const queryResult = useQuery<QueryData, Variables>(query, {
    variables: effectiveVariables,
    fetchPolicy: 'network-only',
  });
  const { error, loading, refetch } = queryResult;
  const pages = useCachedLoadableValue(
    loading,
    error,
    () => (queryResultHasData(queryResult) ? getPages(queryResult) : null),
    [queryResult.data],
  );
  const queryData = useCachedLoadableValue(loading, error, () => queryResult.data, [queryResult.data]);
  const tableData = useCachedLoadableValue(
    loading,
    error,
    () => (queryResultHasData(queryResult) ? getData(queryResult) : null),
    [queryResult],
  );

  const result = useMemo(
    () =>
      ({
        data: tableData ?? [],
        pages: pages ?? 0,
        refetch,
        loading,
        error,
        queryData: queryData ?? undefined,
      }) satisfies UseGraphQLReactTableResult<RowType, QueryData, Variables>,
    [tableData, pages, refetch, loading, error, queryData],
  );

  return result;
}
