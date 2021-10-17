import { useMemo } from 'react';
import { QueryResult, QueryHookOptions, ApolloQueryResult, ApolloError } from '@apollo/client';
import { Filters, SortingRule } from 'react-table';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';
import useCachedLoadableValue from '../useCachedLoadableValue';
import { SortInput } from '../graphqlTypes.generated';

export type GraphQLReactTableVariables = {
  page?: number | null;
  perPage?: number | null;
  filters?: { [field: string]: unknown } | null;
  sort?: SortInput | SortInput[] | null;
};

type QueryResultWithData<QueryData, Variables> = Omit<QueryResult<QueryData, Variables>, 'data'> & {
  data: NonNullable<QueryResult<QueryData, Variables>['data']>;
};

function queryResultHasData<QueryData, Variables>(
  queryResult: QueryResult<QueryData, Variables>,
): queryResult is QueryResultWithData<QueryData, Variables> {
  return queryResult.data != null;
}

export type UseGraphQLReactTableOptions<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = {
  getData: (queryData: QueryResultWithData<QueryData, Variables>) => RowType[];
  getPages: (queryData: QueryResultWithData<QueryData, Variables>) => number;
  useQuery: (options?: QueryHookOptions<QueryData, Variables>) => QueryResult<QueryData, Variables>;
  variables?: Variables;
  filters?: Filters<RowType>;
  sortBy?: SortingRule<RowType>[];
  page?: number;
  pageSize?: number;
};

export default function useGraphQLReactTable<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
>({
  getData,
  getPages,
  useQuery,
  variables,
  filters,
  sortBy,
  page,
  pageSize,
}: UseGraphQLReactTableOptions<RowType, QueryData, Variables>): {
  data: RowType[];
  pages: number;
  refetch: (variables?: Partial<Variables>) => Promise<ApolloQueryResult<QueryData>>;
  loading: boolean;
  error?: ApolloError;
  queryData: QueryData | null | undefined;
} {
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
  const queryResult = useQuery({
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
  const queryData = useCachedLoadableValue(loading, error, () => queryResult.data, [
    queryResult.data,
  ]);
  const tableData = useCachedLoadableValue(
    loading,
    error,
    () => (queryResultHasData(queryResult) ? getData(queryResult) : null),
    [queryResult],
  );

  const result = useMemo(
    () => ({ data: tableData ?? [], pages: pages ?? 0, refetch, loading, error, queryData }),
    [tableData, pages, refetch, loading, error, queryData],
  );

  return result;
}
