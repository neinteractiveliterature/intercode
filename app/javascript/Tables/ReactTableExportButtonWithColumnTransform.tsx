import React, { useMemo } from 'react';
import flatMap from 'lodash/flatMap';

import ReactTableExportButton, { ReactTableExportButtonProps } from './ExportButton';

export type ReactTableExportButtonWithColumnTransformProps = Omit<
  ReactTableExportButtonProps,
  'columns'
> & {
  visibleColumnIds: string[];
  columnTransform: (columnId: string) => string | string[];
};

function ReactTableExportButtonWithColumnTransform({
  exportUrl,
  filtered,
  sorted,
  visibleColumnIds,
  columnTransform,
}: ReactTableExportButtonWithColumnTransformProps) {
  const columns = useMemo(() => flatMap(visibleColumnIds, columnTransform), [
    visibleColumnIds,
    columnTransform,
  ]);

  return (
    <ReactTableExportButton
      exportUrl={exportUrl}
      filtered={filtered}
      sorted={sorted}
      columns={columns}
    />
  );
}

export default ReactTableExportButtonWithColumnTransform;
