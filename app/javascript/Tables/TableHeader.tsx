import { ReactNode } from 'react';
import { Filters, SortingRule } from 'react-table';

import ColumnSelector from './ColumnSelector';
import ExportButton from './ExportButton';
import { UseColumnSelectionResult } from './useColumnSelection';

export type TableHeaderProps<RowType extends Record<string, undefined>> = {
  columnSelectionProps: UseColumnSelectionResult<RowType>;
  exportButton?: ReactNode;
  exportUrl?: string;
  filters: Filters<RowType>;
  renderLeftContent?: () => ReactNode;
  renderRightContent?: () => ReactNode;
  sortBy: SortingRule<RowType>[];
};

function TableHeader<RowType extends Record<string, undefined>>({
  columnSelectionProps,
  exportButton,
  exportUrl,
  filters,
  renderLeftContent,
  renderRightContent,
  sortBy,
}: TableHeaderProps<RowType>): JSX.Element {
  return (
    <div className="d-flex mb-2">
      <div className="flex-grow-1">
        {exportButton ||
          (exportUrl && (
            <ExportButton
              exportUrl={exportUrl}
              filters={filters}
              sortBy={sortBy}
              columns={columnSelectionProps.visibleColumnIds}
            />
          ))}
        {(renderLeftContent || (() => null))()}
      </div>
      <div>
        {(renderRightContent || (() => null))()}
        <ColumnSelector {...columnSelectionProps} />
      </div>
    </div>
  );
}

export default TableHeader;
