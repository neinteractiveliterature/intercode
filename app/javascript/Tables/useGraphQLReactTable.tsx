import { QueryResult, QueryHookOptions } from '@apollo/client';
import { Filter, SortingRule } from 'react-table';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';
import useCachedLoadableValue from '../useCachedLoadableValue';

export type GraphQLReactTableVariables = {
  page?: number | null;
  perPage?: number | null;
  filters?: { [field: string]: any } | null;
  sort?: { field: string; desc: boolean }[] | null;
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
  RowType extends object,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = {
  getData: (queryData: QueryResultWithData<QueryData, Variables>) => RowType[];
  getPages: (queryData: QueryResultWithData<QueryData, Variables>) => number;
  useQuery: (options?: QueryHookOptions<QueryData, Variables>) => QueryResult<QueryData, Variables>;
  variables?: Variables;
  filtered?: Filter[];
  sorted?: SortingRule[];
  page?: number;
  pageSize?: number;
};

export default function useGraphQLReactTable<
  RowType extends object,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
>({
  getData,
  getPages,
  useQuery,
  variables,
  filtered,
  sorted,
  page,
  pageSize,
}: UseGraphQLReactTableOptions<RowType, QueryData, Variables>) {
  const queryResult = useQuery({
    variables: {
      ...(variables as Variables),
      page: (page ?? 0) + 1,
      perPage: pageSize,
      filters: reactTableFiltersToTableResultsFilters(filtered),
      sort: reactTableSortToTableResultsSort(sorted),
    },
    fetchPolicy: 'network-only',
  });
  const { error, loading } = queryResult;
  const pages = useCachedLoadableValue(
    loading,
    error,
    () => (queryResultHasData(queryResult) ? getPages(queryResult) : null),
    [getPages, queryResult],
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

  const reactTableProps = {
    data: tableData ?? [],
    pages: pages ?? 0,
    manual: true,
    filterable: true,
    loading,
  };

  return [reactTableProps, { queryResult, queryData }] as const;
}
