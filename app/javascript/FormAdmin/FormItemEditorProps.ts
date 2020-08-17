import {
  WithRequiredProperties,
  ParsedFormItemWithGeneratedIds,
  ParsedFormItem,
} from './FormItemUtils';

export type FormItemEditorProps<FormItemType extends ParsedFormItem<any, any>> = {
  formItem: ParsedFormItemWithGeneratedIds<WithRequiredProperties<FormItemType>>;
  setFormItem: React.Dispatch<
    React.SetStateAction<ParsedFormItemWithGeneratedIds<WithRequiredProperties<FormItemType>>>
  >;
};
