import { ImageAttachmentConfig } from '../../BuiltInFormControls/MarkdownInput';
import { FormItemValueType, TypedFormItem } from '../../FormAdmin/FormItemUtils';
import { FormType } from '../../graphqlTypes.generated';

export type FormResponseReference = {
  type: 'Event' | 'EventProposal';
  id: string;
};

export type CommonFormItemInputProps<FormItemType extends TypedFormItem> = {
  formItem: FormItemType;
  formTypeIdentifier: FormType;
  value: FormItemValueType<FormItemType> | undefined | null;
  valueInvalid: boolean;
  onInteract: (identifier: string) => void;
  onChange: (value: FormItemValueType<FormItemType> | null | undefined) => void;
  formResponseReference?: FormResponseReference;
  imageAttachmentConfig?: ImageAttachmentConfig;
};
