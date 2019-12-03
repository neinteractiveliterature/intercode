import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  preferencesMatch,
  TimeblockPropType,
  TimeblockOmissionPropType,
  TimeblockPreferenceAPIRepresentationPropType,
} from '../TimeblockTypes';
import {
  describeOrdinality,
  describeTimeblock,
  getColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
} from '../TimeblockUtils';
import TextDiffDisplay from './TextDiffDisplay';

function findOrdinalityForCell(value, cell) {
  const existingPreference = value
    .find((p) => preferencesMatch(p, {
      start: cell.timespan.start,
      finish: cell.timespan.finish,
      label: cell.timeblock.label,
    }));
  return (existingPreference || {}).ordinality;
}

function TimeblockPreferenceItemChangeDisplay({ formItem, convention, change }) {
  const renderCell = (cell, column) => {
    const key = column.dayStart.format('dddd');
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

TimeblockPreferenceItemChangeDisplay.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      timeblocks: PropTypes.arrayOf(TimeblockPropType.isRequired).isRequired,
      omit_timeblocks: PropTypes.arrayOf(TimeblockOmissionPropType.isRequired).isRequired,
      hide_timestamps: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  change: PropTypes.shape({
    previous_value: PropTypes.arrayOf(
      TimeblockPreferenceAPIRepresentationPropType.isRequired,
    ).isRequired,
    new_value: PropTypes.arrayOf(
      TimeblockPreferenceAPIRepresentationPropType.isRequired,
    ).isRequired,
  }).isRequired,
};

export default TimeblockPreferenceItemChangeDisplay;
