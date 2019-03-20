import { uniq } from 'lodash';

export default function useColumnSelection({
  alwaysVisibleColumns, defaultVisibleColumns, possibleColumns, history,
}) {
  const effectiveAlwaysVisibleColumns = alwaysVisibleColumns || [];

  const getVisibleColumnIds = () => {
    const params = new URLSearchParams(history.location.search);
    if (params.get('columns')) {
      return uniq([...effectiveAlwaysVisibleColumns, ...params.get('columns').split(',')]);
    }

    if (defaultVisibleColumns != null) {
      return uniq([...effectiveAlwaysVisibleColumns, ...defaultVisibleColumns]);
    }

    return possibleColumns.map(column => column.id);
  };

  const getVisibleColumns = () => {
    const visibleColumnIds = getVisibleColumnIds();
    return possibleColumns.filter(column => visibleColumnIds.includes(column.id));
  };

  const setVisibleColumnIds = (columnIds) => {
    const params = new URLSearchParams(history.location.search);
    params.set('columns', columnIds.join(','));
    history.replace(`${history.location.pathname}?${params.toString()}`);
  };

  return [
    { columns: getVisibleColumns() }, // reactTableProps
    {
      alwaysVisibleColumns: effectiveAlwaysVisibleColumns,
      possibleColumns,
      getVisibleColumnIds,
      getVisibleColumns,
      setVisibleColumnIds,
    },
  ];
}
