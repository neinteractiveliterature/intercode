import { ReactNode } from 'react';
import Select, { Props } from 'react-select';
import { FormGroupWithLabel } from '@neinteractiveliterature/litform';

export type SelectWithLabelProps<OptionType, IsMulti extends boolean> = Props<OptionType, IsMulti> & {
  label: ReactNode;
  helpText?: ReactNode;
};

function SelectWithLabel<OptionType, IsMulti extends boolean = false>({
  label,
  helpText,
  ...otherProps
}: SelectWithLabelProps<OptionType, IsMulti>): React.JSX.Element {
  return (
    <FormGroupWithLabel label={label} helpText={helpText}>
      {(id) => <Select<OptionType, IsMulti> inputId={id} {...otherProps} />}
    </FormGroupWithLabel>
  );
}

export default SelectWithLabel;
