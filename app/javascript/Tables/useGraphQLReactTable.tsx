import { useQuery, DocumentNode, QueryResult } from '@apollo/client';
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

export type UseGraphQLReactTableOptions<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = {
  getData: (queryData: QueryResult<QueryData, Variables>) => RowType[];
  getPages: (queryData: QueryResult<QueryData, Variables>) => number;
  query: DocumentNode;
  variables?: Variables;
  filtered?: Filter[];
  sorted?: SortingRule[];
  page?: number;
  pageSize?: number;
};

export default function useGraphQLReactTable<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
>({
  getData,
  getPages,
  query,
  variables,
  filtered,
  sorted,
  page,
  pageSize,
}: UseGraphQLReactTableOptions<QueryData, RowType, Variables>) {
  const queryResult = useQuery<QueryData, Variables>(query, {
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
  const pages = useCachedLoadableValue(loading, error, () => getPages(queryResult), [
    getPages,
    queryResult,
  ]);
  const queryData = useCachedLoadableValue(loading, error, () => queryResult.data, [
    queryResult.data,
  ]);
  const tableData = useCachedLoadableValue(loading, error, () => getData(queryResult), [
    queryResult,
  ]);

  const reactTableProps = {
    data: tableData ?? [],
    pages: pages ?? 0,
    manual: true,
    filterable: true,
    loading,
  };

  return [reactTableProps, { queryResult, queryData }] as const;
}
