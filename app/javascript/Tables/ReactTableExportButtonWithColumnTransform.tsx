import { useMemo } from 'react';
import flatMap from 'lodash/flatMap';

import ReactTableExportButton, { ReactTableExportButtonProps } from './ExportButton';

export type ReactTableExportButtonWithColumnTransformProps<
  RowType extends Record<string, unknown>,
> = Omit<ReactTableExportButtonProps<RowType>, 'columns'> & {
  visibleColumnIds: string[];
  columnTransform: (columnId: string) => string | string[];
};

function ReactTableExportButtonWithColumnTransform<RowType extends Record<string, unknown>>({
  visibleColumnIds,
  columnTransform,
  ...otherProps
}: ReactTableExportButtonWithColumnTransformProps<RowType>): JSX.Element {
  const columns = useMemo(
    () => flatMap(visibleColumnIds, columnTransform),
    [visibleColumnIds, columnTransform],
  );

  return <ReactTableExportButton {...otherProps} columns={columns} />;
}

export default ReactTableExportButtonWithColumnTransform;
