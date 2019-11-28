import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

function TimeblockPreferenceItemDisplay({ formItem, convention, value }) {
  const renderCell = (cell, column) => {
    const key = column.dayStart.format('dddd');
    if (cell == null) {
      return <td key={key} className="table-secondary" />;
    }

    const existingPreference = value
      .find((p) => preferencesMatch(p, {
        start: cell.timespan.start,
        finish: cell.timespan.finish,
        label: cell.timeblock.label,
      }));
    const { ordinality } = (existingPreference || {});
    const ordinalityString = (ordinality || '').toString();

    return (
      <td
        key={key}
        className={classNames(
          'align-middle',
          'text-center',
          {
            'bg-success text-white': ordinalityString === '1',
            'table-success': ['2', '3'].includes(ordinalityString),
            'bg-danger text-white': ordinalityString === 'X',
          },
        )}
      >
        <span
          className={classNames({
            'font-weight-bold': ['1', '2'].includes(ordinalityString),
          })}
        >
          {describeOrdinality(ordinality)}
        </span>
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

TimeblockPreferenceItemDisplay.propTypes = {
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
  value: PropTypes.arrayOf(TimeblockPreferenceAPIRepresentationPropType.isRequired).isRequired,
};

export default TimeblockPreferenceItemDisplay;
