import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import TimeblockTypes, { TimeblockPropType, TimeblockPreferencePropType } from '../TimeblockTypes';

const { preferencesMatch } = TimeblockTypes;

class TimeblockPreferenceCell extends React.Component {
  static propTypes = {
    dayStart: MomentPropTypes.momentObj.isRequired,
    timeblock: TimeblockPropType.isRequired,
    render: PropTypes.bool.isRequired,
    start: MomentPropTypes.momentObj.isRequired,
    finish: MomentPropTypes.momentObj.isRequired,
    existingPreferences: PropTypes.arrayOf(TimeblockPreferencePropType.isRequired).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  getHypotheticalPreference = () => ({
    start: this.props.start,
    finish: this.props.finish,
    label: this.props.timeblock.label,
  })

  selectorDidChange = (event) => {
    this.props.onChange(event.target.value, this.getHypotheticalPreference());
  }

  render = () => {
    if (!this.props.render) {
      return <td key={this.props.dayStart.format('dddd')} />;
    }

    const hypotheticalPreference = this.getHypotheticalPreference();

    const existingPreference = this.props.existingPreferences.find(p =>
      preferencesMatch(p, hypotheticalPreference));
    const { ordinality } = (existingPreference || {});

    return (
      <td key={this.props.dayStart.format('dddd')}>
        <select value={ordinality || ''} onChange={this.selectorDidChange} className="form-control">
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
