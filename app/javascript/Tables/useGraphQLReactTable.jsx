import { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';

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
  const [cachedPageCount, setCachedPageCount] = useState(null);
  const { error, loading } = queryResult;
  const dataAvailable = !(loading || error);
  const pages = (dataAvailable ? getPages(queryResult) : cachedPageCount);
  if (dataAvailable && cachedPageCount !== pages) {
    setCachedPageCount(pages);
  }

  const reactTableProps = {
    data: dataAvailable ? getData(queryResult) : [],
    pages,
    manual: true,
    filterable: true,
    loading,
  };

  return [reactTableProps, queryResult];
}
