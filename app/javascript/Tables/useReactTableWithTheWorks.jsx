import React from 'react';

import useColumnSelection from './useColumnSelection';
import useGraphQLReactTable from './useGraphQLReactTable';
import useLocalStorageReactTable from './useLocalStorageReactTable';
import useReactRouterReactTable from './useReactRouterReactTable';
import useCachedLoadableValue from '../useCachedLoadableValue';

export const QueryDataContext = React.createContext({});

export default function useReactTableWithTheWorks({
  alwaysVisibleColumns,
  decodeFilterValue,
  defaultVisibleColumns,
  encodeFilterValue,
  getData,
  getPages,
  getPossibleColumns,
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
    decodeFilterValue, encodeFilterValue, onPageChange, onFilteredChange, onSortedChange,
  });
  const [graphQLReactTableProps, { queryResult, queryData }] = useGraphQLReactTable({
    getData,
    getPages,
    query,
    variables,
    page: reactRouterReactTableProps.page,
    pageSize: localStorageReactTableProps.pageSize,
    filtered: reactRouterReactTableProps.filtered,
    sorted: reactRouterReactTableProps.sorted,
  });

  const possibleColumns = useCachedLoadableValue(
    queryResult.loading,
    queryResult.error,
    () => getPossibleColumns(queryResult.data),
    [getPossibleColumns, queryResult],
  );

  const [columnSelectionReactTableProps, columnSelectionProps] = useColumnSelection({
    alwaysVisibleColumns,
    defaultVisibleColumns,
    possibleColumns: possibleColumns || [],
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

  return [reactTableProps, {
    tableHeaderProps, columnSelectionProps, queryResult, queryData,
  }];
}
