import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { enableUniqueIds } from 'react-html-id';

import CaptionLegend from './CaptionLegend';
import {
  describeTimeblock,
  getColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
} from '../TimeblockUtils';
import {
  preferencesMatch,
  TimeblockPropType,
  TimeblockOmissionPropType,
  TimeblockPreferenceAPIRepresentationPropType,
} from '../TimeblockTypes';
import TimeblockPreferenceCell from './TimeblockPreferenceCell';

class TimeblockPreferenceItemInput extends React.Component {
  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      preferences: (this.props.value || []).map((apiRepresentation) => ({
        start: moment(apiRepresentation.start),
        finish: moment(apiRepresentation.finish),
        label: apiRepresentation.label,
        ordinality: apiRepresentation.ordinality,
      })),
    };
  }

  preferenceDidChange = (newOrdinality, hypotheticalPreference) => {
    const existingPreference = this.state.preferences
      .find((p) => preferencesMatch(p, hypotheticalPreference));

    if (newOrdinality === '') {
      this.setState((prevState) => ({
        preferences: prevState.preferences
          .filter((p) => (!(preferencesMatch(p, hypotheticalPreference)))),
      }), this.preferencesDidChange);
    } else if (existingPreference) {
      this.setState((prevState) => ({
        preferences: prevState.preferences.map((p) => {
          if (preferencesMatch(p, hypotheticalPreference)) {
            return { ...p, ordinality: newOrdinality };
          }

          return p;
        }),
      }), this.preferencesDidChange);
    } else {
      this.setState((prevState) => ({
        preferences: [
          ...prevState.preferences,
          {
            ...hypotheticalPreference,
            ordinality: newOrdinality,
          },
        ],
      }), this.preferencesDidChange);
    }
  }

  preferencesDidChange = () => {
    this.props.onChange(this.state.preferences.map((preference) => ({
      start: preference.start.toISOString(),
      finish: preference.finish.toISOString(),
      label: preference.label,
      ordinality: preference.ordinality,
    })));
  }

  render = () => {
    const columns = getValidTimeblockColumns(this.props.convention, this.props.formItem);
    const rows = rotateTimeblockColumnsToRows(this.props.formItem, columns);

    return (
      <fieldset className="form-group">
        <CaptionLegend formItem={this.props.formItem} />
        <table className="table">
          <thead>
            <tr>
              <th />
              {columns.map((column) => (
                <th key={column.dayStart.toString()}>
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
                    this.props.formItem.properties.hide_timestamps
                      ? null
                      : (
                        <>
                          <br />
                          <small>{describeTimeblock(row.timeblock)}</small>
                        </>
                      )
                  }
                </td>
                {row.cells.map((cell, x) => (
                  cell
                    ? (
                      <TimeblockPreferenceCell
                        key={cell.dayStart.format('dddd')}
                        timeblock={cell.timeblock}
                        existingPreferences={this.state.preferences}
                        dayStart={cell.dayStart}
                        start={cell.timespan.start}
                        finish={cell.timespan.finish}
                        onChange={this.preferenceDidChange}
                      />
                    )
                    : <td key={columns[x].dayStart.format('dddd')} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    );
  };
}

TimeblockPreferenceItemInput.propTypes = {
  formItem: PropTypes.shape({
    caption: PropTypes.string,
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
  value: PropTypes.arrayOf(TimeblockPreferenceAPIRepresentationPropType.isRequired),
  onChange: PropTypes.func.isRequired,
};

TimeblockPreferenceItemInput.defaultProps = {
  value: [],
};

export default TimeblockPreferenceItemInput;
