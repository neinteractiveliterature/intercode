import { useMemo } from 'react';

import {
  preferencesMatch,
  ParsedTimeblockPreference,
  UnparsedTimeblockPreference,
} from '../TimeblockTypes';
import {
  describeOrdinality,
  describeTimeblock,
  useGetColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
  ConcreteTimeblock,
  TimeblockColumn,
} from '../TimeblockUtils';
import TextDiffDisplay from './TextDiffDisplay';
import { TimeblockPreferenceFormItem } from '../../FormAdmin/FormItemUtils';
import { ConventionForTimespanUtils } from '../../TimespanUtils';
import { ParsedFormResponseChange } from './FormItemChangeUtils';

function findOrdinalityForCell(
  value: (ParsedTimeblockPreference | UnparsedTimeblockPreference)[],
  cell: ConcreteTimeblock,
) {
  const existingPreference = value.find((p) =>
    preferencesMatch(p, {
      start: cell.timespan.start,
      finish: cell.timespan.finish,
    }),
  );
  return existingPreference?.ordinality;
}

export type TimeblockPreferenceItemChangeDisplayProps = {
  formItem: TimeblockPreferenceFormItem;
  convention: ConventionForTimespanUtils;
  change: ParsedFormResponseChange<TimeblockPreferenceFormItem>;
};

function TimeblockPreferenceItemChangeDisplay({
  formItem,
  convention,
  change,
}: TimeblockPreferenceItemChangeDisplayProps) {
  const getColumnHeader = useGetColumnHeader();
  const renderCell = (cell: ConcreteTimeblock | null, column: TimeblockColumn) => {
    const key = column.dayStart.valueOf();
    if (cell == null) {
      return <td key={key} className="table-secondary" />;
    }

    const before = findOrdinalityForCell(change.previous_value || [], cell);
    const after = findOrdinalityForCell(change.new_value || [], cell);

    return (
      <td key={key} className="align-middle text-center">
        <TextDiffDisplay before={describeOrdinality(before)} after={describeOrdinality(after)} />
      </td>
    );
  };

  const columns = useMemo(() => getValidTimeblockColumns(convention, formItem), [
    convention,
    formItem,
  ]);
  const rows = useMemo(() => rotateTimeblockColumnsToRows(formItem, columns), [columns, formItem]);

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th />
          {columns.map((column) => (
            <th key={column.dayStart.toString()} className="text-center">
              {getColumnHeader(column)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.timeblock.label}>
            <td>
              {row.timeblock.label}
              {formItem.rendered_properties.hide_timestamps ? null : (
                <>
                  <br />
                  <small>{describeTimeblock(row.timeblock)}</small>
                </>
              )}
            </td>
            {row.cells.map((cell, x) => renderCell(cell, columns[x]))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeblockPreferenceItemChangeDisplay;
