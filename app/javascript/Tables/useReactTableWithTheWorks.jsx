import { useState } from 'react';
import isEqual from 'lodash-es/isEqual';

import useColumnSelection from './useColumnSelection';
import useGraphQLReactTable from './useGraphQLReactTable';
import useLocalStorageReactTable from './useLocalStorageReactTable';
import useReactRouterReactTable from './useReactRouterReactTable';

export default function useReactTableWithTheWorks({
  alwaysVisibleColumns,
  decodeFilterValue,
  defaultVisibleColumns,
  encodeFilterValue,
  getData,
  getPages,
  getPossibleColumns,
  history,
  onPageChange,
  onPageSizeChange,
  onFilteredChange,
  onSortedChange,
  query,
  storageKeyPrefix,
  variables,
}) {
  const localStorageReactTableProps = useLocalStorageReactTable(
    storageKeyPrefix,
    { onPageSizeChange },
  );
  const reactRouterReactTableProps = useReactRouterReactTable({
    decodeFilterValue, encodeFilterValue, history, onPageChange, onFilteredChange, onSortedChange,
  });
  const [graphQLReactTableProps, queryResult] = useGraphQLReactTable({
    getData,
    getPages,
    query,
    variables,
    page: reactRouterReactTableProps.page,
    pageSize: localStorageReactTableProps.pageSize,
    filtered: reactRouterReactTableProps.filtered,
    sorted: reactRouterReactTableProps.sorted,
  });

  const [cachedPossibleColumns, setCachedPossibleColumns] = useState([]);
  let possibleColumns = cachedPossibleColumns;
  if (!queryResult.loading && !queryResult.error) {
    possibleColumns = getPossibleColumns(queryResult.data);
    if (!isEqual(possibleColumns.map(c => c.id), cachedPossibleColumns.map(c => c.id))) {
      setCachedPossibleColumns(possibleColumns);
    }
  }

  const [columnSelectionReactTableProps, columnSelectionProps] = useColumnSelection({
    alwaysVisibleColumns,
    defaultVisibleColumns,
    possibleColumns,
    history,
  });

  const reactTableProps = {
    ...columnSelectionReactTableProps,
    ...localStorageReactTableProps,
    ...reactRouterReactTableProps,
    ...graphQLReactTableProps,
  };

  const tableHeaderProps = {
    columnSelectionProps,
    filtered: reactTableProps.filtered,
    loading: reactTableProps.loading,
    sorted: reactTableProps.sorted,
  };

  return [reactTableProps, { tableHeaderProps, columnSelectionProps, queryResult }];
}
