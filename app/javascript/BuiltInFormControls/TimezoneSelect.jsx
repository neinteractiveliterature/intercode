/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import moment from 'moment-timezone';
import { enableUniqueIds } from 'react-html-id';

const NOW = new Date().getTime();
const TIMEZONE_OPTIONS = moment.tz.names()
  .map(name => moment.tz.zone(name))
  .sort((a, b) => ((b.offsets[0] - a.offsets[0]) || a.name.localeCompare(b.name)))
  .map((zone) => {
    let offsetIndex = zone.untils.findIndex(until => until > NOW);
    if (offsetIndex === -1) {
      offsetIndex = zone.untils.length - 1;
    }

    const offset = zone.offsets[offsetIndex];
    const offsetSign = offset < 0 ? '-' : '+';
    const offsetHours = Math.floor(Math.abs(offset / 60));
    const offsetMinutes = Math.round(Math.abs(offset % 60));
    const formattedOffset = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

    return {
      label: `[${formattedOffset}] ${zone.name}`,
      value: zone.name,
    };
  });

class TimezoneSelect extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const { label, ...otherProps } = this.props;
    const selectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={selectId}>
          {label}
        </label>
        <Select id={selectId} options={TIMEZONE_OPTIONS} {...otherProps} />
      </div>
    );
  }
}

export default TimezoneSelect;
