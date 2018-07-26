/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/lib/Async';
import moment from 'moment-timezone';
import { enableUniqueIds } from 'react-html-id';
import createFilterOptions from 'react-select-fast-filter-options';

const NOW = new Date().getTime();
const TIMEZONE_OPTIONS = moment.tz.names()
  .map(name => moment.tz.zone(name))
  .sort((a, b) => ((b.offsets[0] - a.offsets[0]) || a.name.localeCompare(b.name)))
  .filter(zone => zone.population >= 10000)
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
      population: zone.population,
    };
  });

const TIMEZONE_OPTIONS_BY_NAME = {};
TIMEZONE_OPTIONS.forEach((zone) => { TIMEZONE_OPTIONS_BY_NAME[zone.value] = zone; });

const fastFilterOptions = createFilterOptions({ options: TIMEZONE_OPTIONS });
const defaultOptions = TIMEZONE_OPTIONS.sort((a, b) => b.population - a.population).slice(0, 50);
const loadOptions = async (inputValue) => {
  const filtered = fastFilterOptions(TIMEZONE_OPTIONS, inputValue);
  const populationSorted = filtered.sort((a, b) => b.population - a.population);
  return populationSorted.slice(0, 50);
};

class TimezoneSelect extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const { label, value, onChange, ...otherProps } = this.props;
    const selectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={selectId}>
          {label}
        </label>
        <AsyncSelect
          id={selectId}
          defaultOptions={defaultOptions}
          loadOptions={loadOptions}
          value={TIMEZONE_OPTIONS_BY_NAME[value]}
          onChange={(newValue) => { onChange(newValue.value); }}
          {...otherProps}
        />
      </div>
    );
  }
}

export default TimezoneSelect;
