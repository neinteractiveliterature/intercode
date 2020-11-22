import { useMemo, ChangeEvent } from 'react';

import {
  preferencesMatch,
  TimeblockDefinition,
  ParsedTimeblockPreference,
  TimeblockPreferenceOrdinality,
} from '../TimeblockTypes';

export type TimeblockPreferenceCellChangeCallback = (
  newOrdinality: TimeblockPreferenceOrdinality | '',
  hypotheticalPreference: { start: Date; finish: Date; label: string },
) => void;

export type TimeblockPreferenceCellProps = {
  dayStart: Date;
  timeblock: TimeblockDefinition;
  start: Date;
  finish: Date;
  existingPreferences: ParsedTimeblockPreference[];
  onChange: TimeblockPreferenceCellChangeCallback;
};

function TimeblockPreferenceCell(props: TimeblockPreferenceCellProps) {
  const { start, finish, timeblock, dayStart, existingPreferences, onChange } = props;

  const hypotheticalPreference = useMemo(
    () => ({
      start,
      finish,
      label: timeblock.label,
    }),
    [finish, start, timeblock.label],
  );

  const existingPreference = useMemo(
    () => existingPreferences.find((p) => preferencesMatch(p, hypotheticalPreference)),
    [existingPreferences, hypotheticalPreference],
  );

  const selectorDidChange = (event: ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case '':
      case '1':
      case '2':
      case '3':
      case 'X':
        onChange(event.target.value, hypotheticalPreference);
        break;
      default:
        break;
    }
  };

  const { ordinality } = existingPreference || {};

  return (
    <td key={dayStart.valueOf()}>
      <select value={ordinality || ''} onChange={selectorDidChange} className="form-control">
        <option value="">Don&apos;t care</option>
        <option value="1">1st choice</option>
        <option value="2">2nd choice</option>
        <option value="3">3rd choice</option>
        <option value="X">Prefer not</option>
      </select>
    </td>
  );
}

export default TimeblockPreferenceCell;
