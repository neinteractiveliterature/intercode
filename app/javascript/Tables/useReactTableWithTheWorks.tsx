import React, { createContext, useMemo, useEffect, InputHTMLAttributes } from 'react';
import { MaybeMasked } from '@apollo/client';
import {
  CellProps,
  Column,
  Hooks,
  Renderer,
  Row,
  TableInstance,
  TableState,
  UseRowSelectRowProps,
  useTable,
  useFilters,
  useSortBy,
  usePagination,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
} from 'react-table';

import useColumnSelection, { UseColumnSelectionOptions, UseColumnSelectionResult } from './useColumnSelection';
import useGraphQLReactTable, {
  GraphQLReactTableVariables,
  UseGraphQLReactTableOptions,
  UseGraphQLReactTableResult,
} from './useGraphQLReactTable';
import useLocalStorageReactTable, { UseLocalStorageReactTableOptions } from './useLocalStorageReactTable';
import useReactRouterReactTable, { UseReactRouterReactTableOptions } from './useReactRouterReactTable';
import useCachedLoadableValue from '../useCachedLoadableValue';
import type { TableHeaderProps } from './TableHeader';

export function createQueryDataContext<DataType>(): React.Context<DataType | null | undefined> {
  return createContext<DataType | null | undefined>(undefined);
}
export const QueryDataContext = createContext({});

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }
>(function IndeterminateCheckbox({ indeterminate, ...rest }, ref) {
  const defaultRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = ref ?? defaultRef;

  React.useEffect(() => {
    if (typeof resolvedRef !== 'function' && resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate ?? false;
    }
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" className="form-check" ref={resolvedRef} {...rest} />
    </>
  );
});

export type UseReactTableWithTheWorksOptions<
  RowType extends Record<string, unknown>,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = Omit<UseColumnSelectionOptions<RowType>, 'possibleColumns'> &
  UseGraphQLReactTableOptions<RowType, QueryData, Variables> &
  UseLocalStorageReactTableOptions &
  UseReactRouterReactTableOptions<RowType> & {
    defaultState?: Partial<TableState<RowType>>;
    getPossibleColumns: (queryData: MaybeMasked<QueryData>) => Column<RowType>[];
    storageKeyPrefix: string;
    rowSelect?: boolean;
  };

export type UseReactTableWithTheWorksResult<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = Pick<UseGraphQLReactTableResult<RowType, QueryData, Variables>, 'refetch' | 'queryData' | 'loading' | 'error'> & {
  tableInstance: TableInstance<RowType>;
  columnSelectionProps: UseColumnSelectionResult<RowType>;
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
  getPossibleColumns,
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

  const possibleColumns = useCachedLoadableValue(
    loading,
    error,
    () => (queryData ? getPossibleColumns(queryData) : []),
    [queryData],
  );

  const memoizedPossibleColumns = useMemo(() => possibleColumns ?? [], [possibleColumns]);

  const columnSelectionProps = useColumnSelection<RowType>({
    alwaysVisibleColumns,
    defaultVisibleColumns,
    possibleColumns: memoizedPossibleColumns,
  });

  const tableHeaderProps: TableHeaderProps<RowType> = useMemo(
    () => ({ columnSelectionProps, filters, sortBy }),
    [columnSelectionProps, filters, sortBy],
  );

  const tableInstance = useTable<RowType>(
    {
      columns: columnSelectionProps.visibleColumns,
      data,
      defaultColumn: {
        defaultCanFilter: false,
        disableSortBy: true,
      },
      initialState: {
        filters,
        sortBy,
        pageSize,
        pageIndex: page ?? 0,
      },
      manualFilters: true,
      manualPagination: true,
      manualSortBy: true,
      pageCount: pages,
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination,
    useFlexLayout,
    useRowSelect,
    (hooks: Hooks<RowType>) => {
      if (rowSelect) {
        hooks.visibleColumns.push((columns) => {
          const selectedColumnRenderer: Renderer<CellProps<RowType>> = ({ row }: { row: Row<RowType> }) => {
            // I can't figure out how to get typescript to infer this properly
            const rowAsUseRowSelectRowProps = row as unknown as UseRowSelectRowProps<Record<string, unknown>>;
            const { toggleRowSelected, isSelected, getToggleRowSelectedProps } = rowAsUseRowSelectRowProps;
            const toggle = (event: React.SyntheticEvent) => {
              event.stopPropagation();
              toggleRowSelected(!isSelected);
            };

            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            return <IndeterminateCheckbox {...getToggleRowSelectedProps()} onChange={toggle} />;
          };

          const selectedColumn: Column<RowType> = {
            id: '_selected',
            width: 20,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            ),
            Cell: selectedColumnRenderer,
          };
          return [selectedColumn, ...columns];
        });
      }
    },
  );

  useEffect(() => {
    updateSearch({
      filters: tableInstance.state.filters,
      sortBy: tableInstance.state.sortBy,
      page: tableInstance.state.pageIndex,
    });
  }, [updateSearch, tableInstance.state.filters, tableInstance.state.sortBy, tableInstance.state.pageIndex]);

  useEffect(() => {
    setAndStorePageSize(tableInstance.state.pageSize);
  }, [setAndStorePageSize, tableInstance.state.pageSize]);

  return {
    tableInstance,
    tableHeaderProps,
    columnSelectionProps,
    queryData,
    error,
    loading,
    refetch,
  };
}
