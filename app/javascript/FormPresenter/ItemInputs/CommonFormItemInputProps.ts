import { TypedFormItem } from '../../FormAdmin/FormItemUtils';
import { FormType } from '../../graphqlTypes.generated';

export type CommonFormItemInputProps<FormItemType extends TypedFormItem> = {
  formItem: FormItemType;
  formTypeIdentifier: FormType;
  value: unknown | undefined | null;
  valueInvalid: boolean;
  onInteract: (identifier: string) => void;
  onChange: (value: any) => void;
};
