const DEFAULT_PROPERTIES = {
  age_restrictions: {
    caption: '',
  },
  date: {
    caption: '',
  },
  event_email: {},
  free_text: {
    caption: '',
    lines: 1,
    format: 'plain',
  },
  static_text: {
    content: '',
    style: 'normal',
  },
  timespan: {
    caption: '',
  },
};

export default function buildNewFormItem(itemType) {
  return {
    item_type: itemType,
    properties: DEFAULT_PROPERTIES[itemType] || {},
  };
}
