import { useMemo } from 'react';
import { TypedDocumentNode } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

import { reactTableFiltersToTableResultsFilters, reactTableSortToTableResultsSort } from './TableUtils';
import { SortInput } from '../graphqlTypes.generated';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

export type GraphQLReactTableVariables = {
  page?: number | null;
  perPage?: number | null;
  filters?: { [field: string]: unknown } | null;
  sort?: SortInput | SortInput[] | null;
};

export type UseGraphQLReactTableOptions<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = {
  getData: (result: { data: QueryData }) => RowType[];
  getPages: (result: { data: QueryData }) => number;
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

  // Keep showing the previous page of results while the next one loads
  const queryData = queryResult.data ?? queryResult.previousData;
  const { pages, tableData } = useMemo(
    () =>
      queryData != null
        ? { pages: getPages({ data: queryData }), tableData: getData({ data: queryData }) }
        : { pages: 0, tableData: [] },
    // Recompute only when the data changes, so that the row array keeps a stable identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryData],
  );

  const result = useMemo(
    () =>
      ({
        data: tableData,
        pages,
        refetch,
        loading,
        error,
        queryData,
      }) satisfies UseGraphQLReactTableResult<RowType, QueryData, Variables>,
    [tableData, pages, refetch, loading, error, queryData],
  );

  return result;
}
