import { ReactNode, useMemo } from 'react';
import { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';

import ColumnSelector from './ColumnSelector';
import ExportButton from './ExportButton';
import { UseColumnSelectionResult } from './useColumnSelection';

export type TableHeaderProps<TData> = {
  columns: ColumnDef<TData>[];
  columnSelectionProps: UseColumnSelectionResult;
  exportButton?: ReactNode;
  exportUrl?: string;
  filters: ColumnFiltersState;
  renderLeftContent?: () => ReactNode;
  renderRightContent?: () => ReactNode;
  sortBy: SortingState;
};

function TableHeader<TData>({
  columns,
  columnSelectionProps,
  exportButton,
  exportUrl,
  filters,
  renderLeftContent,
  renderRightContent,
  sortBy,
}: TableHeaderProps<TData>): React.JSX.Element {
  const visibleColumnIds = useMemo(() => {
    return Object.entries(columnSelectionProps.columnVisibility).reduce((acc, [id, visible]) => {
      if (visible) {
        return [...acc, id];
      } else {
        return acc;
      }
    }, []);
  }, [columnSelectionProps.columnVisibility]);

  return (
    <div className="d-flex mb-2">
      <div className="flex-grow-1">
        {exportButton ||
          (exportUrl && (
            <ExportButton exportUrl={exportUrl} filters={filters} sortBy={sortBy} columns={visibleColumnIds} />
          ))}
        {(renderLeftContent || (() => null))()}
      </div>
      <div>
        {(renderRightContent || (() => null))()}
        <ColumnSelector
          alwaysVisibleColumns={columnSelectionProps.alwaysVisibleColumns}
          possibleColumns={columns}
          columnVisibility={columnSelectionProps.columnVisibility}
          setColumnVisibility={columnSelectionProps.setColumnVisibility}
        />
      </div>
    </div>
  );
}

export default TableHeader;
