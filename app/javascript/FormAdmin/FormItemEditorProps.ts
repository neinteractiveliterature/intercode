import {
  WithRequiredProperties,
  ParsedFormItemWithGeneratedIds,
  TypedFormItem,
} from './FormItemUtils';

export type FormItemEditorProps<FormItemType extends TypedFormItem> = {
  formItem: ParsedFormItemWithGeneratedIds<WithRequiredProperties<FormItemType>>;
  setFormItem: React.Dispatch<
    React.SetStateAction<ParsedFormItemWithGeneratedIds<WithRequiredProperties<FormItemType>>>
  >;
};
