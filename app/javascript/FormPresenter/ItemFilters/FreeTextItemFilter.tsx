import { BootstrapFormInput } from '@neinteractiveliterature/litform';
import { FreeTextFormItem } from '../../FormAdmin/FormItemUtils';
import { CommonFormItemFilterProps } from './CommonFormItemFilterProps';

export type FreeTextItemFilterProps = CommonFormItemFilterProps<FreeTextFormItem>;

function FreeTextItemFilter({ formItem, onChange, value }: FreeTextItemFilterProps): JSX.Element {
  const filterValue = value ? (value[0] ?? '') : '';
  return (
    <BootstrapFormInput
      label={formItem.public_description}
      value={filterValue}
      onTextChange={(text) => onChange([text])}
    />
  );
}

export default FreeTextItemFilter;
