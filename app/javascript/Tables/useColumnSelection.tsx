import { useMemo, useCallback } from 'react';
import { Column } from 'react-table';
import uniq from 'lodash/uniq';
import { useLocation, useSearchParams } from 'react-router-dom';
import { notEmpty } from '@neinteractiveliterature/litform';

export type UseColumnSelectionOptions<RowType extends Record<string, unknown>> = {
  alwaysVisibleColumns?: string[];
  defaultVisibleColumns?: string[];
  possibleColumns: Column<RowType>[];
};

export type UseColumnSelectionResult<RowType extends Record<string, unknown>> = {
  alwaysVisibleColumns: string[];
  possibleColumns: Column<RowType>[];
  visibleColumnIds: string[];
  visibleColumns: Column<RowType>[];
  setVisibleColumnIds: React.Dispatch<string[]>;
};

export default function useColumnSelection<RowType extends Record<string, unknown>>({
  alwaysVisibleColumns,
  defaultVisibleColumns,
  possibleColumns,
}: UseColumnSelectionOptions<RowType>): UseColumnSelectionResult<RowType> {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const visibleColumnIds = useMemo(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('columns')) {
      return uniq([...(alwaysVisibleColumns ?? []), ...(params.get('columns')?.split(',') ?? [])]);
    }

    if (defaultVisibleColumns != null) {
      return uniq([...(alwaysVisibleColumns ?? []), ...defaultVisibleColumns]);
    }

    return possibleColumns.map((column) => column.id).filter(notEmpty);
  }, [defaultVisibleColumns, alwaysVisibleColumns, location.search, possibleColumns]);

  const visibleColumns: Column<RowType>[] = useMemo(
    () => possibleColumns.filter((column) => column.id != null && visibleColumnIds.includes(column.id)),
    [possibleColumns, visibleColumnIds],
  );

  const setVisibleColumnIds = useCallback(
    (columnIds: string[]) => {
      const params = new URLSearchParams(searchParams);
      params.set('columns', columnIds.join(','));
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const result = useMemo(
    () => ({
      alwaysVisibleColumns: alwaysVisibleColumns ?? [],
      possibleColumns,
      visibleColumnIds,
      visibleColumns,
      setVisibleColumnIds,
    }),
    [alwaysVisibleColumns, possibleColumns, visibleColumnIds, visibleColumns, setVisibleColumnIds],
  );

  return result;
}
