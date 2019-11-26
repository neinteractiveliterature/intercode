import DefaultProperties from '../../../config/form_item_default_properties.json';

export default function buildNewFormItem(itemType) {
  return {
    item_type: itemType,
    properties: DefaultProperties[itemType] || {},
  };
}
