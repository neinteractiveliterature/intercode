import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import { preferencesMatch, TimeblockPropType, TimeblockPreferencePropType } from '../TimeblockTypes';

function TimeblockPreferenceCell(props) {
  const {
    start, finish, timeblock, dayStart, existingPreferences, onChange,
  } = props;

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

  const selectorDidChange = (event) => {
    onChange(event.target.value, hypotheticalPreference);
  };

  const { ordinality } = (existingPreference || {});

  return (
    <td key={dayStart.format('dddd')}>
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

TimeblockPreferenceCell.propTypes = {
  dayStart: MomentPropTypes.momentObj.isRequired,
  timeblock: TimeblockPropType.isRequired,
  start: MomentPropTypes.momentObj.isRequired,
  finish: MomentPropTypes.momentObj.isRequired,
  existingPreferences: PropTypes.arrayOf(TimeblockPreferencePropType.isRequired).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeblockPreferenceCell;
