import React, { useMemo } from 'react';

import {
  preferencesMatch,
  TimeblockPreference,
  ConcreteTimeblock,
} from '../TimeblockTypes';
import {
  describeOrdinality,
  describeTimeblock,
  getColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
  TimeblockColumn,
} from '../TimeblockUtils';
import TextDiffDisplay from './TextDiffDisplay';
import { TimeblockPreferenceFormItem } from '../../FormAdmin/FormItemTypes';
import { ConventionForTimespanUtils } from '../../TimespanUtils';
import { ParsedFormResponseChange } from './FormItemChangeUtils';

function findOrdinalityForCell(value: TimeblockPreference[], cell: ConcreteTimeblock) {
  const existingPreference = value
    .find((p) => preferencesMatch(p, {
      start: cell.timespan.start,
      finish: cell.timespan.finish,
      label: cell.timeblock.label,
      ordinality: 'X',
    }));
  return (existingPreference || {}).ordinality;
}

export type TimeblockPreferenceItemChangeDisplayProps = {
  formItem: TimeblockPreferenceFormItem,
  convention: ConventionForTimespanUtils,
  change: ParsedFormResponseChange<TimeblockPreference[], TimeblockPreferenceFormItem>,
};

function TimeblockPreferenceItemChangeDisplay(
  { formItem, convention, change }: TimeblockPreferenceItemChangeDisplayProps,
) {
  const renderCell = (cell: ConcreteTimeblock | null, column: TimeblockColumn) => {
    const key = column.dayStart.toFormat('EEEE');
    if (cell == null) {
      return <td key={key} className="table-secondary" />;
    }

    const before = findOrdinalityForCell(change.previous_value || [], cell);
    const after = findOrdinalityForCell(change.new_value || [], cell);

    return (
      <td key={key} className="align-middle text-center">
        <TextDiffDisplay
          before={describeOrdinality(before)}
          after={describeOrdinality(after)}
        />
      </td>
    );
  };

  const columns = useMemo(
    () => getValidTimeblockColumns(convention, formItem),
    [convention, formItem],
  );
  const rows = useMemo(
    () => rotateTimeblockColumnsToRows(formItem, columns),
    [columns, formItem],
  );

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
              {
                formItem.properties.hide_timestamps
                  ? null
                  : (
                    <>
                      <br />
                      <small>{describeTimeblock(row.timeblock)}</small>
                    </>
                  )
              }
            </td>
            {row.cells.map((cell, x) => renderCell(cell, columns[x]))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeblockPreferenceItemChangeDisplay;
