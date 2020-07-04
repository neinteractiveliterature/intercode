import React, { ReactNode } from 'react';
import Select, { Props } from 'react-select';

import FormGroupWithLabel from './FormGroupWithLabel';

export type SelectWithLabelProps<OptionType> = Props<OptionType> & {
  label: ReactNode,
  helpText?: ReactNode,
};

function SelectWithLabel<OptionType>(
  { label, helpText, ...otherProps }: SelectWithLabelProps<OptionType>,
) {
  return (
    <FormGroupWithLabel label={label} name={otherProps.name} helpText={helpText}>
      {(id) => <Select inputId={id} {...otherProps} />}
    </FormGroupWithLabel>
  );
}

export default SelectWithLabel;
