import { useMemo } from 'react';
import flatMap from 'lodash/flatMap';

import ReactTableExportButton, { ReactTableExportButtonProps } from './ExportButton';

export type ReactTableExportButtonWithColumnTransformProps<RowType extends object> = Omit<
  ReactTableExportButtonProps<RowType>,
  'columns'
> & {
  visibleColumnIds: string[];
  columnTransform: (columnId: string) => string | string[];
};

function ReactTableExportButtonWithColumnTransform<RowType extends object>({
  visibleColumnIds,
  columnTransform,
  ...otherProps
}: ReactTableExportButtonWithColumnTransformProps<RowType>) {
  const columns = useMemo(() => flatMap(visibleColumnIds, columnTransform), [
    visibleColumnIds,
    columnTransform,
  ]);

  return (
    <ReactTableExportButton
      {...otherProps}
      columns={columns}
    />
  );
}

export default ReactTableExportButtonWithColumnTransform;
