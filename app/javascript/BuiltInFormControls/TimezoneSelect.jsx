/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { IANAZone } from 'luxon';
import lunr from 'lunr';

import timezoneSelectData from './timezoneSelectData.json';
import useUniqueId from '../useUniqueId';

const NOW = new Date().getTime();

function getFormattedOffset(zoneName) {
  const zone = IANAZone.create(zoneName);
  let offset = zone.offset(NOW);
  if (zone.name.startsWith('Etc/')) {
    // POSIX offsets are inverted
    offset *= -1;
  }
  const offsetSign = offset < 0 ? '-' : '+';
  const offsetHours = Math.floor(Math.abs(offset / 60));
  const offsetMinutes = Math.round(Math.abs(offset % 60));
  return `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
}

function TimezoneSelect(props) {
  const searchIndex = useMemo(
    () => lunr.Index.load(timezoneSelectData.index),
    [],
  );

  const loadOptions = (inputValue) => {
    if (!inputValue) {
      return [];
    }

    const terms = inputValue.split(' ');
    const filtered = searchIndex.query((query) => {
      terms.forEach((term) => {
        query.term(term, { fields: ['shortOffsetNames'], boost: 5 });
        query.term(term, { fields: ['longOffsetNames'], boost: 2, wildcard: lunr.Query.wildcard.TRAILING });
        query.term(term, { fields: ['name'], wildcard: lunr.Query.wildcard.TRAILING });
      });
    })
      .slice(0, 50)
      .map((result) => timezoneSelectData.zones[result.ref]);
    return filtered;
  };

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
        value={timezoneSelectData.zones[value]}
        onInputChange={(input) => filterOptions(input)}
        onChange={(newValue) => { onChange(newValue?.name); }}
        getOptionValue={(zone) => zone.name}
        filterOption={() => true}
        formatOptionLabel={(zone) => {
          const formattedOffset = getFormattedOffset(zone.name);
          return (
            <>
              <span className="badge badge-secondary">{formattedOffset}</span>
              {' '}
              {zone.name}
              {' ('}
              {zone.longOffsetNames.join('/')}
              )
            </>
          );
        }}
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
