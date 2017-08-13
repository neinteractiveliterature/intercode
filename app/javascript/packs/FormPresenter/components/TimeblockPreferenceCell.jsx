// @flow

import React from 'react';
import TimeblockTypes from '../TimeblockTypes';
import type { Timeblock, TimeblockPreference } from '../TimeblockTypes';

type Props = {
  dayStart: moment,
  timeblock: Timeblock,
  render: boolean,
  start: moment,
  finish: moment,
  existingPreferences: Array<TimeblockPreference>,
  onChange: (string, TimeblockPreference) => undefined,
};

const { preferencesMatch } = TimeblockTypes;

class TimeblockPreferenceCell extends React.Component {
  getHypotheticalPreference = () => ({
    start: this.props.start,
    finish: this.props.finish,
    label: this.props.timeblock.label,
  })

  props: Props

  selectorDidChange = (event: SyntheticInputEvent) => {
    this.props.onChange(event.target.value, this.getHypotheticalPreference());
  }

  render = () => {
    if (!this.props.render) {
      return <td key={this.props.dayStart.format('dddd')} />;
    }

    const hypotheticalPreference = this.getHypotheticalPreference();

    const existingPreference = this.props.existingPreferences.find(
      p => preferencesMatch(p, hypotheticalPreference),
    );
    let ordinality = '';
    if (existingPreference) {
      ordinality = existingPreference.ordinality;
    }

    return (
      <td key={this.props.dayStart.format('dddd')}>
        <select value={ordinality} onChange={this.selectorDidChange} className="form-control">
          <option value="">Don&apos;t care</option>
          <option value="1">1st choice</option>
          <option value="2">2nd choice</option>
          <option value="3">3rd choice</option>
          <option value="X">Prefer not</option>
        </select>
      </td>
    );
  }
}

export default TimeblockPreferenceCell;
