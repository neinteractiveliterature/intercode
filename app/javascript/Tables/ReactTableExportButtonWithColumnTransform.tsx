import { useMemo } from 'react';
import flatMap from 'lodash/flatMap';

import ReactTableExportButton, { ReactTableExportButtonProps } from './ExportButton';
import { VisibilityState } from '@tanstack/react-table';
import { columnVisibilityToVisibleColumnIds } from './useColumnSelection';

export type ReactTableExportButtonWithColumnTransformProps<RowType extends Record<string, unknown>> = Omit<
  ReactTableExportButtonProps<RowType>,
  'columns'
> & {
  columnVisibility: VisibilityState;
  columnTransform: (columnId: string) => string | string[];
};

function ReactTableExportButtonWithColumnTransform<RowType extends Record<string, unknown>>({
  columnVisibility,
  columnTransform,
  ...otherProps
}: ReactTableExportButtonWithColumnTransformProps<RowType>): JSX.Element {
  const columns = useMemo(
    () => flatMap(columnVisibilityToVisibleColumnIds(columnVisibility), columnTransform),
    [columnVisibility, columnTransform],
  );

  return <ReactTableExportButton {...otherProps} columns={columns} />;
}

export default ReactTableExportButtonWithColumnTransform;
