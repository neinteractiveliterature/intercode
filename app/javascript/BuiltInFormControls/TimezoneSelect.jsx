/* eslint-disable jsx-a11y/label-has-for */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import moment from 'moment-timezone';
import createFilterOptions from 'react-select-fast-filter-options';
import memoize from 'lodash/memoize';
import useUniqueId from '../useUniqueId';

const NOW = new Date().getTime();

const getOffset = (zone) => {
  let offsetIndex = zone.untils.findIndex((until) => until > NOW);
  if (offsetIndex === -1) {
    offsetIndex = zone.untils.length - 1;
  }

  return zone.offsets[offsetIndex];
};

const buildTimezoneOptions = () => moment.tz.names()
  .map((name) => moment.tz.zone(name))
  .sort((a, b) => ((getOffset(b) - getOffset(a)) || a.name.localeCompare(b.name)))
  .map((zone) => {
    const offset = getOffset(zone);
    const offsetSign = offset < 0 ? '+' : '-'; // POSIX offsets are inverted
    const offsetHours = Math.floor(Math.abs(offset / 60));
    const offsetMinutes = Math.round(Math.abs(offset % 60));
    const formattedOffset = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

    return {
      label: `[${formattedOffset}] ${zone.name}`,
      value: zone.name,
      population: zone.population,
    };
  });

const getTimezoneOptions = memoize(buildTimezoneOptions);

const buildTimezoneOptionsByName = () => {
  const timezoneOptionsByName = {};
  getTimezoneOptions().forEach((zone) => { timezoneOptionsByName[zone.value] = zone; });
  return timezoneOptionsByName;
};

const getTimezoneOptionsByName = memoize(buildTimezoneOptionsByName);

const buildFastFilterOptions = () => createFilterOptions({ options: getTimezoneOptions(), indexes: ['value'] });
const getFastFilterOptions = memoize(buildFastFilterOptions);

export const loadOptions = (inputValue) => {
  const filtered = getFastFilterOptions()(getTimezoneOptions(), inputValue);
  if (inputValue) {
    const populationSorted = filtered.sort((a, b) => b.population - a.population);
    return populationSorted.slice(0, 50);
  }
  return filtered;
};

function TimezoneSelect(props) {
  const [options, setOptions] = useState(loadOptions(''));

  const filterOptions = (input) => {
    setOptions(loadOptions(input));
  };

  const {
    label, value, onChange, ...otherProps
  } = props;
  const selectId = useUniqueId('timezone-select-');

  return (
    <div className="form-group">
      <label htmlFor={selectId}>
        {label}
      </label>
      <Select
        inputId={selectId}
        options={options}
        isClearable
        value={getTimezoneOptionsByName()[value]}
        onInputChange={(input) => filterOptions(input)}
        onChange={(newValue) => { onChange(newValue.value); }}
        {...otherProps}
      />
    </div>
  );
}

TimezoneSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TimezoneSelect.defaultProps = {
  value: null,
};

export default TimezoneSelect;
