import { useMemo, useCallback } from 'react';
import { Column } from 'react-table';
import uniq from 'lodash/uniq';
import { useHistory, useLocation } from 'react-router-dom';
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
  const history = useHistory();
  const location = useLocation();

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
    () =>
      possibleColumns.filter((column) => column.id != null && visibleColumnIds.includes(column.id)),
    [possibleColumns, visibleColumnIds],
  );

  const setVisibleColumnIds = useCallback(
    (columnIds: string[]) => {
      const params = new URLSearchParams(history.location.search);
      params.set('columns', columnIds.join(','));
      history.replace(`${history.location.pathname}?${params.toString()}`);
    },
    [history],
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
