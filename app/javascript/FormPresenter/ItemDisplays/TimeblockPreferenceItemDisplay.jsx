import React from 'react';
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

class TimeblockPreferenceItemDisplay extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string.isRequired,
        timeblocks: PropTypes.arrayOf(TimeblockPropType.isRequired).isRequired,
        omit_timeblocks: PropTypes.arrayOf(TimeblockOmissionPropType.isRequired).isRequired,
      }).isRequired,
    }).isRequired,
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.arrayOf(TimeblockPreferenceAPIRepresentationPropType.isRequired).isRequired,
  };

  renderCell = (cell) => {
    if (!cell) {
      return null;
    }

    const existingPreference = this.props.value
      .find(p => preferencesMatch(p, {
        start: cell.timespan.start,
        finish: cell.timespan.finish,
        label: cell.timeblock.label,
      }));
    const { ordinality } = (existingPreference || {});

    return <span>{describeOrdinality(ordinality)}</span>;
  }

  render = () => {
    const columns = getValidTimeblockColumns(this.props.convention, this.props.formItem);
    const rows = rotateTimeblockColumnsToRows(this.props.formItem, columns);

    return (
      <table className="table">
        <thead>
          <tr>
            <th />
            {columns.map(column => (
              <th key={column.dayStart.toString()}>
                {getColumnHeader(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.timeblock.label}>
              <td>
                {row.timeblock.label}
                <br />
                <small>{describeTimeblock(row.timeblock)}</small>
              </td>
              {row.cells.map((cell, x) => (
                <td key={columns[x].dayStart.format('dddd')}>
                  {this.renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default TimeblockPreferenceItemDisplay;
