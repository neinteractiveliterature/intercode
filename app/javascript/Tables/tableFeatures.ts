import {
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type Cell,
  type CellContext,
  type Column,
  type ColumnDef,
  type ColumnHelper,
  type HeaderContext,
  type Row,
  type RowData,
  type Table,
} from '@tanstack/react-table';

// The table library features our tables use.  Filtering, sorting and pagination all happen on the server (see
// useReactTableWithTheWorks), so there are no row models or filter/sort functions to register here, only the features
// that hold the state and provide the column and row APIs.
export const appTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
});

export type AppTableFeatures = typeof appTableFeatures;

// Aliases for the table library's types with our features filled in, so that table code only has to say what its row
// type is.
export type AppColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<AppTableFeatures, TData, TValue>;
// A list of columns for a table has columns with a variety of value types, which TypeScript can't express as one
// ColumnDef type any other way.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAppColumnDef<TData extends RowData> = AppColumnDef<TData, any>;
export type AppColumn<TData extends RowData, TValue = unknown> = Column<AppTableFeatures, TData, TValue>;
export type AppRow<TData extends RowData> = Row<AppTableFeatures, TData>;
export type AppCell<TData extends RowData, TValue = unknown> = Cell<AppTableFeatures, TData, TValue>;
export type AppTable<TData extends RowData> = Table<AppTableFeatures, TData>;
export type AppCellContext<TData extends RowData, TValue = unknown> = CellContext<AppTableFeatures, TData, TValue>;
export type AppHeaderContext<TData extends RowData, TValue = unknown> = HeaderContext<AppTableFeatures, TData, TValue>;
export type AppColumnHelper<TData extends RowData> = ColumnHelper<AppTableFeatures, TData>;

export function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<TData> {
  return createColumnHelper<AppTableFeatures, TData>();
}
