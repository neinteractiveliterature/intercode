import { TypedFormItem } from '../../FormAdmin/FormItemUtils';

export type CommonFormItemInputProps<FormItemType extends TypedFormItem> = {
  formItem: FormItemType,
  value: unknown | undefined | null,
  valueInvalid: boolean,
  onInteract: (identifier: string) => void,
  onChange: (value: any) => void,
};
