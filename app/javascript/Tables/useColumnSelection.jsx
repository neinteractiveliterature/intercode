import { useMemo } from 'react';
import uniq from 'lodash/uniq';
import { useHistory, useLocation } from 'react-router-dom';

export default function useColumnSelection({
  alwaysVisibleColumns, defaultVisibleColumns, possibleColumns,
}) {
  const history = useHistory();
  const location = useLocation();
  const effectiveAlwaysVisibleColumns = alwaysVisibleColumns || [];

  const visibleColumnIds = useMemo(
    () => {
      const params = new URLSearchParams(location.search);
      if (params.get('columns')) {
        return uniq([...effectiveAlwaysVisibleColumns, ...params.get('columns').split(',')]);
      }

      if (defaultVisibleColumns != null) {
        return uniq([...effectiveAlwaysVisibleColumns, ...defaultVisibleColumns]);
      }

      return possibleColumns.map((column) => column.id);
    },
    [defaultVisibleColumns, effectiveAlwaysVisibleColumns, location, possibleColumns],
  );

  const visibleColumns = useMemo(
    () => possibleColumns.filter((column) => visibleColumnIds.includes(column.id)),
    [possibleColumns, visibleColumnIds],
  );

  const setVisibleColumnIds = (columnIds) => {
    const params = new URLSearchParams(history.location.search);
    params.set('columns', columnIds.join(','));
    history.replace(`${history.location.pathname}?${params.toString()}`);
  };

  return [
    { columns: visibleColumns }, // reactTableProps
    {
      alwaysVisibleColumns: effectiveAlwaysVisibleColumns,
      possibleColumns,
      visibleColumnIds,
      visibleColumns,
      setVisibleColumnIds,
    },
  ];
}
