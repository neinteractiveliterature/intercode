import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

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

function TimeblockPreferenceItemInput({
  convention, formItem, value, onChange,
}) {
  const preferences = useMemo(
    () => (value || []).map((apiRepresentation) => ({
      start: moment(apiRepresentation.start),
      finish: moment(apiRepresentation.finish),
      label: apiRepresentation.label,
      ordinality: apiRepresentation.ordinality,
    })),
    [value],
  );

  const preferencesDidChange = useCallback(
    (newPreferences) => {
      onChange(newPreferences.map((preference) => ({
        start: preference.start.toISOString(),
        finish: preference.finish.toISOString(),
        label: preference.label,
        ordinality: preference.ordinality,
      })));
    },
    [onChange],
  );

  const preferenceDidChange = (newOrdinality, hypotheticalPreference) => {
    const existingPreference = preferences
      .find((p) => preferencesMatch(p, hypotheticalPreference));

    if (newOrdinality === '') {
      preferencesDidChange(preferences
        .filter((p) => !(preferencesMatch(p, hypotheticalPreference))));
    } else if (existingPreference) {
      preferencesDidChange(preferences.map((p) => {
        if (preferencesMatch(p, hypotheticalPreference)) {
          return { ...p, ordinality: newOrdinality };
        }

        return p;
      }));
    } else {
      preferencesDidChange([
        ...preferences,
        {
          ...hypotheticalPreference,
          ordinality: newOrdinality,
        },
      ]);
    }
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
    <fieldset className="form-group">
      <CaptionLegend formItem={formItem} />
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
              {row.cells.map((cell, x) => (
                cell
                  ? (
                    <TimeblockPreferenceCell
                      key={cell.dayStart.format('dddd')}
                      timeblock={cell.timeblock}
                      existingPreferences={preferences}
                      dayStart={cell.dayStart}
                      start={cell.timespan.start}
                      finish={cell.timespan.finish}
                      onChange={preferenceDidChange}
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
