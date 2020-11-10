import { createContext, useMemo, useEffect } from 'react';
import { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
  Column,
  TableInstance,
  TableState,
  useTable,
  useFilters,
  useSortBy,
  usePagination,
  useResizeColumns,
  useFlexLayout,
} from 'react-table';

import useColumnSelection, {
  UseColumnSelectionOptions,
  UseColumnSelectionResult,
} from './useColumnSelection';
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
import type { TableHeaderProps } from './TableHeader';
import useWhyDidYouUpdate from '../useWhyDidYouUpdate';

export function createQueryDataContext<DataType>() {
  return createContext<DataType | null | undefined>(undefined);
}
export const QueryDataContext = createContext({});

export type UseReactTableWithTheWorksOptions<
  RowType extends object,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = Omit<UseColumnSelectionOptions<RowType>, 'possibleColumns'> &
  UseGraphQLReactTableOptions<RowType, QueryData, Variables> &
  UseLocalStorageReactTableOptions &
  UseReactRouterReactTableOptions<RowType> & {
    defaultState?: Partial<TableState<RowType>>;
    getPossibleColumns: (queryData: QueryData) => Column<RowType>[];
    storageKeyPrefix: string;
  };

export type UseReactTableWithTheWorksResult<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = {
  tableInstance: TableInstance<RowType>;
  columnSelectionProps: UseColumnSelectionResult<RowType>;
  error: ApolloError | undefined;
  loading: boolean;
  refetch: (variables?: Partial<Variables>) => Promise<ApolloQueryResult<QueryData>>;
  queryData: QueryData | null | undefined;
  tableHeaderProps: TableHeaderProps<RowType>;
};

export default function useReactTableWithTheWorks<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
>({
  alwaysVisibleColumns,
  decodeFilterValue,
  defaultState,
  defaultVisibleColumns,
  encodeFilterValue,
  getData,
  getPages,
  getPossibleColumns,
  useQuery,
  storageKeyPrefix,
  variables,
}: UseReactTableWithTheWorksOptions<
  RowType,
  QueryData,
  Variables
>): UseReactTableWithTheWorksResult<QueryData, RowType, Variables> {
  const { pageSize, setAndStorePageSize } = useLocalStorageReactTable(storageKeyPrefix);
  const { page, filters, sortBy, updateSearch } = useReactRouterReactTable({
    defaultState,
    decodeFilterValue,
    encodeFilterValue,
  });
  const { data, pages, loading, error, refetch, queryData } = useGraphQLReactTable<
    RowType,
    QueryData,
    Variables
  >({
    getData,
    getPages,
    useQuery,
    variables,
    page,
    pageSize,
    filters,
    sortBy,
  });

  const possibleColumns = useCachedLoadableValue(
    loading,
    error,
    () => getPossibleColumns(queryData!),
    [queryData],
  );

  const columnSelectionProps = useColumnSelection<RowType>({
    alwaysVisibleColumns,
    defaultVisibleColumns,
    possibleColumns: possibleColumns || [],
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
  );

  useEffect(() => {
    updateSearch({
      filters: tableInstance.state.filters,
      sortBy: tableInstance.state.sortBy,
      page: tableInstance.state.pageIndex,
    });
  }, [
    updateSearch,
    tableInstance.state.filters,
    tableInstance.state.sortBy,
    tableInstance.state.pageIndex,
  ]);

  useWhyDidYouUpdate('pageSizeEffect', {
    setAndStorePageSize,
    pageSize: tableInstance.state.pageSize,
  });
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
