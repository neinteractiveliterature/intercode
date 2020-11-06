import { ReactNode } from 'react';
import { Filter, SortingRule } from 'react-table';

import ColumnSelector from './ColumnSelector';
import ExportButton from './ExportButton';
import useColumnSelection from './useColumnSelection';

export type TableHeaderProps = {
  columnSelectionProps: ReturnType<typeof useColumnSelection>[1];
  exportButton?: ReactNode;
  exportUrl?: string;
  filtered: Filter[];
  renderLeftContent?: () => ReactNode;
  renderRightContent?: () => ReactNode;
  sorted: SortingRule[];
};

function TableHeader({
  columnSelectionProps,
  exportButton,
  exportUrl,
  filtered,
  renderLeftContent,
  renderRightContent,
  sorted,
}: TableHeaderProps) {
  return (
    <div className="d-flex mb-2">
      <div className="flex-grow-1">
        {exportButton ||
          (exportUrl && (
            <ExportButton
              exportUrl={exportUrl}
              filtered={filtered}
              sorted={sorted}
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
