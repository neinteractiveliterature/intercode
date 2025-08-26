import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import CaptionLegend from './CaptionLegend';
import {
  describeTimeblock,
  getColumnHeader,
  getValidTimeblockColumns,
  rotateTimeblockColumnsToRows,
} from '../TimeblockUtils';
import {
  preferencesMatch,
  parseTimeblockPreference,
  serializeTimeblockPreference,
  ParsedTimeblockPreference,
  TimeblockPreferenceOrdinality,
} from '../TimeblockTypes';
import TimeblockPreferenceCell, { TimeblockPreferenceCellChangeCallback } from './TimeblockPreferenceCell';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { TimeblockPreferenceFormItem } from '../../FormAdmin/FormItemUtils';
import { ConventionForTimespanUtils } from '../../TimespanUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

export type TimeblockPreferenceItemInputProps = CommonFormItemInputProps<TimeblockPreferenceFormItem> & {
  convention: ConventionForTimespanUtils;
};

function TimeblockPreferenceItemInput({
  convention,
  formItem,
  formTypeIdentifier,
  value: uncheckedValue,
  onChange,
}: TimeblockPreferenceItemInputProps): React.JSX.Element {
  const { t } = useTranslation();
  const format = useAppDateTimeFormat();
  const value = useMemo(() => uncheckedValue ?? [], [uncheckedValue]);

  const preferences = useMemo(() => value.map(parseTimeblockPreference), [value]);

  const preferencesDidChange = useCallback(
    (newPreferences: ParsedTimeblockPreference[]) => {
      onChange(newPreferences.map(serializeTimeblockPreference));
    },
    [onChange],
  );

  const preferenceDidChange: TimeblockPreferenceCellChangeCallback = (newOrdinality, hypotheticalPreference) => {
    const existingPreference = preferences.find((p) => preferencesMatch(p, hypotheticalPreference));

    if (newOrdinality === '') {
      preferencesDidChange(preferences.filter((p) => !preferencesMatch(p, hypotheticalPreference)));
    } else if (existingPreference) {
      preferencesDidChange(
        preferences.map((p) => {
          if (preferencesMatch(p, hypotheticalPreference)) {
            return { ...p, ordinality: newOrdinality };
          }

          return p;
        }),
      );
    } else {
      preferencesDidChange([
        ...preferences,
        {
          ...hypotheticalPreference,
          ordinality: newOrdinality as TimeblockPreferenceOrdinality,
        },
      ]);
    }
  };

  const columns = useMemo(() => getValidTimeblockColumns(convention, formItem), [convention, formItem]);
  const rows = useMemo(() => rotateTimeblockColumnsToRows(formItem, columns), [columns, formItem]);

  return (
    <fieldset className="mb-3">
      <VisibilityDisclosureCard formItem={formItem} formTypeIdentifier={formTypeIdentifier}>
        <CaptionLegend formItem={formItem} />
        <table className="table">
          <thead>
            <tr>
              <th />
              {columns.map((column) => (
                <th key={column.dayStart.toString()}>{getColumnHeader(column, format)}</th>
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
                {row.cells.map((cell, x) =>
                  cell ? (
                    <TimeblockPreferenceCell
                      key={format(cell.dayStart, 'longWeekday')}
                      timeblock={cell.timeblock}
                      existingPreferences={preferences}
                      dayStart={cell.dayStart}
                      start={cell.timespan.start}
                      finish={cell.timespan.finish}
                      onChange={preferenceDidChange}
                    />
                  ) : (
                    <td key={format(columns[x].dayStart, 'longWeekday')} />
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </VisibilityDisclosureCard>
    </fieldset>
  );
}

export default TimeblockPreferenceItemInput;
