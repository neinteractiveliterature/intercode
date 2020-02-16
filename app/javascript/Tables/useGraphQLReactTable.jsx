import { useQuery } from '@apollo/react-hooks';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';
import useCachedLoadableValue from '../useCachedLoadableValue';

export default function useGraphQLReactTable({
  getData, getPages, query, variables, filtered, sorted, page, pageSize,
}) {
  const queryResult = useQuery(query, {
    variables: {
      ...variables,
      page: page + 1,
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
    () => getPages(queryResult),
    [getPages, queryResult],
  );
  const queryData = useCachedLoadableValue(
    loading,
    error,
    () => queryResult.data,
    [queryResult.data],
  );
  const tableData = useCachedLoadableValue(
    loading,
    error,
    () => getData(queryResult),
    [queryResult],
  );

  const reactTableProps = {
    data: tableData || [],
    pages,
    manual: true,
    filterable: true,
    loading,
  };

  return [reactTableProps, { queryResult, queryData }];
}
