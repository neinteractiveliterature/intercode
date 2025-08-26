import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { preferencesMatch, ParsedTimeblockPreference, UnparsedTimeblockPreference } from '../TimeblockTypes';
import {
  describeOrdinality,
  describeTimeblock,
  getColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
  ConcreteTimeblock,
  TimeblockColumn,
} from '../TimeblockUtils';
import TextDiffDisplay from './TextDiffDisplay';
import { TimeblockPreferenceFormItem } from '../../FormAdmin/FormItemUtils';
import { ConventionForTimespanUtils } from '../../TimespanUtils';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';

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
}: TimeblockPreferenceItemChangeDisplayProps): React.JSX.Element {
  const { t } = useTranslation();
  const format = useAppDateTimeFormat();
  const renderCell = (cell: ConcreteTimeblock | null, column: TimeblockColumn) => {
    const key = format(column.dayStart, 'longWeekday');
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

  const columns = useMemo(() => getValidTimeblockColumns(convention, formItem), [convention, formItem]);
  const rows = useMemo(() => rotateTimeblockColumnsToRows(formItem, columns), [columns, formItem]);

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th />
          {columns.map((column) => (
            <th key={column.dayStart.toString()} className="text-center">
              {getColumnHeader(column, format)}
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
                  <small>{describeTimeblock(row.timeblock, t)}</small>
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
