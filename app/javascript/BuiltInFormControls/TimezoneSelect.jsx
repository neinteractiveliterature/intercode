/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { IANAZone } from 'luxon';
import { Search, TfIdfSearchIndex } from 'js-search';

import timezoneSelectData from './timezoneSelectData.json';
import useUniqueId from '../useUniqueId';

class BoostableTfIdfSearchIndex extends TfIdfSearchIndex {
  _createCalculateTfIdf() {
    const baseTfIdf = super._createCalculateTfIdf();
    return (tokens, document, documents) => {
      return (
        baseTfIdf(tokens, document, documents) * (document.$boost ?? 1.0)
      );
    };
  }
}

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
    () => {
      const search = new Search('name');
      search.searchIndex = new BoostableTfIdfSearchIndex('name');
      search.addIndex('nameKeywords');
      search.addIndex('shortOffsetNames');
      search.addIndex('longOffsetNames');
      search.addDocuments(Object.values(timezoneSelectData.zones));
      return search;
    },
    [],
  );

  const loadOptions = (inputValue) => {
    if (!inputValue) {
      return [];
    }

    const filtered = searchIndex.search(inputValue).slice(0, 50);
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
