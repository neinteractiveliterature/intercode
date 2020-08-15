import DefaultProperties from '../../../config/form_item_default_properties.json';
import { TypedFormItem } from './FormItemUtils';

export default function buildNewFormItem<FormItemType extends TypedFormItem>(
  itemType: FormItemType['item_type'],
): FormItemType {
  return {
    item_type: itemType,
    properties: DefaultProperties[itemType] || {},
  } as FormItemType;
}
