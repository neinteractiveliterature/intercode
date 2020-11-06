import { createContext } from 'react';
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
  return createContext<DataType | null | undefined>(undefined);
}
export const QueryDataContext = createContext({});

export type UseReactTableWithTheWorksOptions<
  RowType extends object,
  QueryData,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = Omit<UseColumnSelectionOptions, 'possibleColumns'> &
  UseGraphQLReactTableOptions<RowType, QueryData, Variables> &
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
  useQuery,
  storageKeyPrefix,
  variables,
}: UseReactTableWithTheWorksOptions<RowType, QueryData, Variables>) {
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
    useQuery,
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
