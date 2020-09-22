import React, { ReactNode } from 'react';
import { Filter } from 'react-table';

import ChoiceSetFilter from './ChoiceSetFilter';
import { FilterCodec } from './FilterUtils';

function getBooleanFilterValue(filter: Filter) {
  if (filter == null || filter.value == null) {
    return 'any';
  }

  if (filter.value) {
    return 'true';
  }

  return 'false';
}

export type BooleanChoiceSetFilterProps = {
  filter: Filter;
  onChange: React.Dispatch<boolean | null>;
  renderHeaderCaption?: (value: string) => ReactNode;
  filterCodec?: FilterCodec<string>;
};

function BooleanChoiceSetFilter({ filter, onChange, ...otherProps }: BooleanChoiceSetFilterProps) {
  return (
    <ChoiceSetFilter
      choices={[
        { label: 'any', value: 'any' },
        { label: 'yes', value: 'true' },
        { label: 'no', value: 'false' },
      ]}
      multiple={false}
      onChange={(value) => {
        onChange(value === 'any' ? null : value === 'true');
      }}
      filter={{ ...filter, value: getBooleanFilterValue(filter) }}
      {...otherProps}
    />
  );
}

export default BooleanChoiceSetFilter;
