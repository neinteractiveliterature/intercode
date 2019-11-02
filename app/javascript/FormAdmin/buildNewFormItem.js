const DEFAULT_PROPERTIES = {
  static_text: {
    content: '',
    style: 'normal',
  },
};

export default function buildNewFormItem(itemType) {
  return {
    item_type: itemType,
    properties: DEFAULT_PROPERTIES[itemType] || {},
  };
}
