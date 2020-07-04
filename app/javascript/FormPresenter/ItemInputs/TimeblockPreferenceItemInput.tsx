import React, { useMemo, useCallback } from 'react';
import { DateTime } from 'luxon';

import CaptionLegend from './CaptionLegend';
import {
  describeTimeblock,
  getColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
} from '../TimeblockUtils';
import {
  preferencesMatch,
  TimeblockPreferenceAPIRepresentation,
  TimeblockPreference,
  TimeblockPreferenceOrdinality,
} from '../TimeblockTypes';
import TimeblockPreferenceCell from './TimeblockPreferenceCell';
import { TimeblockPreferenceFormItem } from '../../FormAdmin/FormItemTypes';
import { ConventionForTimespanUtils } from '../../TimespanUtils';

export type TimeblockPreferenceItemInputProps = {
  formItem: TimeblockPreferenceFormItem,
  value?: TimeblockPreferenceAPIRepresentation[] | null,
  convention: ConventionForTimespanUtils,
  onChange: (newValue: TimeblockPreferenceAPIRepresentation[]) => void,
};

function TimeblockPreferenceItemInput({
  convention, formItem, value, onChange,
}: TimeblockPreferenceItemInputProps) {
  const preferences: TimeblockPreference[] = useMemo(
    () => (value ?? []).map((apiRepresentation) => ({
      start: DateTime.fromISO(apiRepresentation.start),
      finish: DateTime.fromISO(apiRepresentation.finish),
      label: apiRepresentation.label,
      ordinality: apiRepresentation.ordinality,
    })),
    [value],
  );

  const preferencesDidChange = useCallback(
    (newPreferences: TimeblockPreference[]) => {
      onChange(newPreferences.map((preference) => ({
        start: preference.start.toISO(),
        finish: preference.finish.toISO(),
        label: preference.label,
        ordinality: preference.ordinality,
      })));
    },
    [onChange],
  );

  const preferenceDidChange = (
    newOrdinality: TimeblockPreferenceOrdinality | '',
    hypotheticalPreference: TimeblockPreference,
  ) => {
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
              <th key={column.dayStart.valueOf()}>
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
                      key={cell.dayStart.toFormat('EEEE')}
                      timeblock={cell.timeblock}
                      existingPreferences={preferences}
                      dayStart={cell.dayStart}
                      start={cell.timespan.start}
                      finish={cell.timespan.finish}
                      onChange={preferenceDidChange}
                    />
                  )
                  : <td key={columns[x].dayStart.toFormat('EEEE')} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  );
}

export default TimeblockPreferenceItemInput;
