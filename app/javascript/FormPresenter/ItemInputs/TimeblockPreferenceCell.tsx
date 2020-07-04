import React, { useMemo } from 'react';
import { DateTime } from 'luxon';

import {
  preferencesMatch, TimeblockDefinition, TimeblockPreference, TimeblockPreferenceOrdinality,
} from '../TimeblockTypes';

export type TimeblockPreferenceCellProps = {
  start: DateTime,
  finish: DateTime,
  timeblock: TimeblockDefinition,
  dayStart: DateTime,
  existingPreferences: TimeblockPreference[],
  onChange: (
    newOrdinality: TimeblockPreferenceOrdinality | '',
    hypotheticalPreference: TimeblockPreference,
  ) => void,
};

function TimeblockPreferenceCell(props: TimeblockPreferenceCellProps) {
  const {
    start, finish, timeblock, dayStart, existingPreferences, onChange,
  } = props;

  const hypotheticalPreference: TimeblockPreference = useMemo(
    () => ({
      start,
      finish,
      label: timeblock.label,
      ordinality: 'X',
    }),
    [finish, start, timeblock.label],
  );

  const existingPreference = useMemo(
    () => existingPreferences.find((p) => preferencesMatch(p, hypotheticalPreference)),
    [existingPreferences, hypotheticalPreference],
  );

  const selectorDidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as TimeblockPreferenceOrdinality, hypotheticalPreference);
  };

  const { ordinality } = (existingPreference || {});

  return (
    <td key={dayStart.toFormat('EEEE')}>
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
