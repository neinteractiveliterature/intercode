export const DEFAULT_PROPERTIES = {
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
  multiple_choice: {
    caption: '',
    style: 'radio_vertical',
    choices: [],
  },
  registration_policy: {
    presets: [],
    allow_custom: true,
  },
  static_text: {
    content: '',
    style: 'normal',
  },
  timeblock_preference: {
    caption: '',
    timeblocks: [],
    omit_timeblocks: [],
    hide_timestamps: false,
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
