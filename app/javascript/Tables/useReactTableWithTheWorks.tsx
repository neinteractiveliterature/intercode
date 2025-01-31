import React, { createContext, useMemo, useEffect } from 'react';
import {
  TableState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  Table,
  ColumnDef,
} from '@tanstack/react-table';

import useColumnSelection, { UseColumnSelectionOptions, UseColumnSelectionResult } from './useColumnSelection';
import useGraphQLReactTable, {
  GraphQLReactTableVariables,
  UseGraphQLReactTableOptions,
  UseGraphQLReactTableResult,
} from './useGraphQLReactTable';
import useLocalStorageReactTable, { UseLocalStorageReactTableOptions } from './useLocalStorageReactTable';
import useReactRouterReactTable, { UseReactRouterReactTableOptions } from './useReactRouterReactTable';
import type { TableHeaderProps } from './TableHeader';

export function createQueryDataContext<DataType>(): React.Context<DataType | null | undefined> {
  return createContext<DataType | null | undefined>(undefined);
}
export const QueryDataContext = createContext({});

export type UseReactTableWithTheWorksOptions<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = UseColumnSelectionOptions<RowType> &
  UseGraphQLReactTableOptions<RowType, QueryData, Variables> &
  UseLocalStorageReactTableOptions &
  UseReactRouterReactTableOptions & {
    defaultState?: Partial<TableState>;
    columns: ColumnDef<RowType>[];
    storageKeyPrefix: string;
    rowSelect?: boolean;
  };

export type UseReactTableWithTheWorksResult<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = Pick<UseGraphQLReactTableResult<RowType, QueryData, Variables>, 'refetch' | 'queryData' | 'loading' | 'error'> & {
  table: Table<RowType>;
  columnSelectionProps: UseColumnSelectionResult;
  tableHeaderProps: TableHeaderProps<RowType>;
};

export default function useReactTableWithTheWorks<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
>({
  alwaysVisibleColumns,
  decodeFilterValue,
  defaultState,
  defaultVisibleColumns,
  encodeFilterValue,
  getData,
  getPages,
  columns,
  query,
  rowSelect,
  storageKeyPrefix,
  variables,
}: UseReactTableWithTheWorksOptions<RowType, QueryData, Variables>): UseReactTableWithTheWorksResult<
  QueryData,
  RowType,
  Variables
> {
  const { pageSize, setAndStorePageSize } = useLocalStorageReactTable(storageKeyPrefix);
  const { page, filters, sortBy, updateSearch } = useReactRouterReactTable({
    defaultState,
    decodeFilterValue,
    encodeFilterValue,
  });
  const { data, pages, loading, error, refetch, queryData } = useGraphQLReactTable<RowType, QueryData, Variables>({
    getData,
    getPages,
    query,
    variables,
    page,
    pageSize,
    filters,
    sortBy,
  });

  const columnSelectionProps = useColumnSelection<RowType>({
    alwaysVisibleColumns,
    defaultVisibleColumns,
    columns: columns,
  });

  const tableHeaderProps: TableHeaderProps<RowType> = useMemo(
    () => ({ columns, columnSelectionProps, filters, sortBy }),
    [columns, columnSelectionProps, filters, sortBy],
  );

  const table = useReactTable<RowType>({
    columns,
    data,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
    },
    initialState: {
      columnFilters: filters,
      sorting: sortBy,
      pagination: {
        pageIndex: page ?? 0,
        pageSize,
      },
      columnVisibility: columnSelectionProps.columnVisibility,
    },
    columnResizeDirection: 'ltr',
    columnResizeMode: 'onChange',
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: pages,
    enableRowSelection: rowSelect,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { columnFilters, sorting, pagination } = table.getState();

  useEffect(() => {
    updateSearch({
      filters: columnFilters,
      sortBy: sorting,
      page: pagination.pageIndex,
    });
  }, [updateSearch, columnFilters, sorting, pagination.pageIndex]);

  useEffect(() => {
    setAndStorePageSize(pagination.pageSize);
  }, [setAndStorePageSize, pagination.pageSize]);

  useEffect(() => {
    table.setColumnVisibility(columnSelectionProps.columnVisibility);
  }, [columnSelectionProps.columnVisibility, table]);

  return {
    table,
    tableHeaderProps,
    columnSelectionProps,
    queryData,
    error,
    loading,
    refetch,
  };
}
