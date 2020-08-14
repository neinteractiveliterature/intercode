import React from 'react';
import { Column } from 'react-table';

import useColumnSelection, { UseColumnSelectionOptions } from './useColumnSelection';
import useGraphQLReactTable, {
  GraphQLReactTableVariables,
  UseGraphQLReactTableOptions,
} from './useGraphQLReactTable';
import useLocalStorageReactTable, {
  UseLocalStorageReactTableOptions,
} from './useLocalStorageReactTable';
import useReactRouterReactTable, {
  UseReactRouterReactTableOptions,
} from './useReactRouterReactTable';
import useCachedLoadableValue from '../useCachedLoadableValue';

export function createQueryDataContext<DataType>() {
  return React.createContext<DataType | null | undefined>(undefined);
}
export const QueryDataContext = React.createContext({});

export type UseReactTableWithTheWorksOptions<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = Omit<UseColumnSelectionOptions, 'possibleColumns'> &
  UseGraphQLReactTableOptions<QueryData, RowType, Variables> &
  UseLocalStorageReactTableOptions &
  UseReactRouterReactTableOptions & {
    getPossibleColumns: (queryData: QueryData) => Column[];
    storageKeyPrefix: string;
  };

export default function useReactTableWithTheWorks<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
>({
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
}: UseReactTableWithTheWorksOptions<QueryData, RowType, Variables>) {
  const localStorageReactTableProps = useLocalStorageReactTable(storageKeyPrefix, {
    onPageSizeChange,
  });
  const reactRouterReactTableProps = useReactRouterReactTable({
    decodeFilterValue,
    encodeFilterValue,
    onPageChange,
    onFilteredChange,
    onSortedChange,
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
    () => getPossibleColumns(queryResult.data!),
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

  return [
    reactTableProps,
    {
      tableHeaderProps,
      columnSelectionProps,
      queryResult,
      queryData,
    },
  ] as const;
}
