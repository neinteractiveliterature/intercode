import React from 'react';
import { Filter } from 'react-table';

import CommitableInput, { CommitableInputProps } from '../BuiltInFormControls/CommitableInput';

export type FreeTextFilterProps = CommitableInputProps & {
  filter?: Filter;
};

function FreeTextFilter({ filter, ...otherProps }: FreeTextFilterProps) {
  return <CommitableInput value={filter?.value} {...otherProps} />;
}

export default FreeTextFilter;
