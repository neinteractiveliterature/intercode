import { useMemo } from 'react';
import uniq from 'lodash/uniq';
import { useHistory, useLocation } from 'react-router-dom';
import { Column } from 'react-table';

import { notEmpty } from '../ValueUtils';

export type UseColumnSelectionOptions = {
  alwaysVisibleColumns?: string[];
  defaultVisibleColumns?: string[];
  possibleColumns: Column<any>[];
};

export default function useColumnSelection({
  alwaysVisibleColumns,
  defaultVisibleColumns,
  possibleColumns,
}: UseColumnSelectionOptions) {
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
  }, [defaultVisibleColumns, alwaysVisibleColumns, location, possibleColumns]);

  const visibleColumns = useMemo(
    () =>
      possibleColumns.filter((column) => column.id != null && visibleColumnIds.includes(column.id)),
    [possibleColumns, visibleColumnIds],
  );

  const setVisibleColumnIds = (columnIds: string[]) => {
    const params = new URLSearchParams(history.location.search);
    params.set('columns', columnIds.join(','));
    history.replace(`${history.location.pathname}?${params.toString()}`);
  };

  return [
    { columns: visibleColumns }, // reactTableProps
    {
      alwaysVisibleColumns: alwaysVisibleColumns ?? [],
      possibleColumns,
      visibleColumnIds,
      visibleColumns,
      setVisibleColumnIds,
    },
  ] as const;
}
