const DEFAULT_PROPERTIES = {
  free_text: {
    caption: '',
    lines: 1,
    format: 'plain',
  },
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
