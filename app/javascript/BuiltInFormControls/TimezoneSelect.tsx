 

import { useState, useMemo, ReactNode, SetStateAction, useId } from 'react';

import * as React from 'react';
import Select from 'react-select';
import { IANAZone } from 'luxon';
import { Search, TfIdfSearchIndex } from 'js-search';

import timezoneSelectData from './timezoneSelectData.json';

function isValidZone(zoneName: string): zoneName is keyof (typeof timezoneSelectData)['zones'] {
  return zoneName in timezoneSelectData.zones;
}

type ZoneData = (typeof timezoneSelectData)['zones']['America/New_York'];

interface TfIdfSearchIndexWithOverridableCreate extends TfIdfSearchIndex {
  _createCalculateTfIdf(): (tokens: string[], document: BoostableDocument, documents: BoostableDocument[]) => number;
}

type BoostableDocument = {
  $boost?: number;
};

class BoostableTfIdfSearchIndex extends TfIdfSearchIndex implements TfIdfSearchIndexWithOverridableCreate {
  _createCalculateTfIdf() {
    /* eslint-disable-next-line no-underscore-dangle */ /* @ts-expect-error We are doing seriously awful things to override private methods here */
    const baseTfIdf = super._createCalculateTfIdf();
    return (tokens: string[], document: BoostableDocument, documents: BoostableDocument[]): number =>
      baseTfIdf(tokens, document, documents) * (document.$boost ?? 1.0);
  }
}

const NOW = new Date().getTime();

function getFormattedOffset(zoneName: string) {
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

export type TimezoneSelectProps = {
  label: ReactNode;
  value?: string | null;
  onChange: React.Dispatch<SetStateAction<string | null | undefined>>;
};

function TimezoneSelect(props: TimezoneSelectProps): JSX.Element {
  const searchIndex = useMemo(() => {
    const search = new Search('name');
    search.searchIndex = new BoostableTfIdfSearchIndex('name');
    search.addIndex('nameKeywords');
    search.addIndex('shortOffsetNames');
    search.addIndex('longOffsetNames');
    search.addDocuments(Object.values(timezoneSelectData.zones));
    return search;
  }, []);

  const loadOptions = (inputValue?: string | null): ZoneData[] => {
    if (!inputValue) {
      return [];
    }

    const filtered = searchIndex.search(inputValue).slice(0, 50);
    return filtered as ZoneData[];
  };

  const [options, setOptions] = useState(loadOptions(''));

  const filterOptions = (input?: string | null) => {
    setOptions(loadOptions(input));
  };

  const { label, value, onChange, ...otherProps } = props;
  const selectId = useId();

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={selectId}>
        {label}
      </label>
      <Select<ZoneData>
        inputId={selectId}
        options={options}
        isClearable
        value={value && isValidZone(value) ? timezoneSelectData.zones[value] : undefined}
        onInputChange={(input) => filterOptions(input)}
        onChange={(newValue: ZoneData | null) => {
          onChange(newValue?.name);
        }}
        getOptionValue={(zone) => zone.name}
        filterOption={() => true}
        formatOptionLabel={(zone) => {
          const formattedOffset = getFormattedOffset(zone.name);
          return (
            <>
              <span className="badge bg-secondary">{formattedOffset}</span> {zone.name}
              {' ('}
              {zone.longOffsetNames.join('/')})
            </>
          );
        }}
        {...otherProps}
      />
    </div>
  );
}

export default TimezoneSelect;
