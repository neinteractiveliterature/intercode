import React, { useMemo, useCallback } from 'react';
import { ColumnDef, TableState } from '@tanstack/react-table';
import { useLocation, useSearchParams } from 'react-router-dom';
import { notEmpty } from '@neinteractiveliterature/litform';

export function columnVisibilityToVisibleColumnIds(columnVisibility: TableState['columnVisibility']): Set<string> {
  const visibleColumnIds = new Set<string>();

  for (const [id, visible] of Object.entries(columnVisibility)) {
    if (visible) {
      visibleColumnIds.add(id);
    }
  }

  return visibleColumnIds;
}

export function visibleColumnIdsToColumnVisibility<TData>(
  visibleColumnIds: Set<string>,
  columns: ColumnDef<TData>[],
): TableState['columnVisibility'] {
  return columns.reduce((acc, column) => {
    if (column.id) {
      return { ...acc, [column.id]: visibleColumnIds.has(column.id) };
    } else {
      return acc;
    }
  }, {});
}

export type UseColumnSelectionOptions<RowType extends Record<string, unknown>> = {
  alwaysVisibleColumns?: string[];
  defaultVisibleColumns?: string[];
  columns: ColumnDef<RowType>[];
};

export type UseColumnSelectionResult = {
  alwaysVisibleColumns: string[];
  columnVisibility: TableState['columnVisibility'];
  setColumnVisibility: React.Dispatch<React.SetStateAction<TableState['columnVisibility']>>;
};

export default function useColumnSelection<RowType extends Record<string, unknown>>({
  alwaysVisibleColumns,
  defaultVisibleColumns,
  columns,
}: UseColumnSelectionOptions<RowType>): UseColumnSelectionResult {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const visibleColumnIds = useMemo(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('columns')) {
      return new Set([...(alwaysVisibleColumns ?? []), ...(params.get('columns')?.split(',') ?? [])]);
    }

    if (defaultVisibleColumns != null) {
      return new Set([...(alwaysVisibleColumns ?? []), ...defaultVisibleColumns]);
    }

    return new Set(columns.map((column) => column.id).filter(notEmpty));
  }, [defaultVisibleColumns, alwaysVisibleColumns, location.search, columns]);

  const columnVisibility: TableState['columnVisibility'] = useMemo(() => {
    return visibleColumnIdsToColumnVisibility(visibleColumnIds, columns);
  }, [columns, visibleColumnIds]);

  const setVisibleColumnIds = useCallback(
    (columnIds: string[]) => {
      const params = new URLSearchParams(searchParams);
      params.set('columns', columnIds.join(','));
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const setColumnVisibility = useCallback(
    (setStateAction: React.SetStateAction<TableState['columnVisibility']>) => {
      let newColumnVisibility: TableState['columnVisibility'];
      if (typeof setStateAction === 'function') {
        newColumnVisibility = setStateAction(columnVisibility);
      } else {
        newColumnVisibility = setStateAction;
      }

      return setVisibleColumnIds([...columnVisibilityToVisibleColumnIds(newColumnVisibility)]);
    },
    [columnVisibility, setVisibleColumnIds],
  );

  const result = useMemo(
    () => ({ alwaysVisibleColumns: alwaysVisibleColumns ?? [], columnVisibility, setColumnVisibility }),
    [alwaysVisibleColumns, columnVisibility, setColumnVisibility],
  );

  return result;
}
