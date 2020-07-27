import PropTypes from 'prop-types';

export type APIFormItem<P> = {
  id: number,
  form_section_id: number,
  position: number,
  item_type: string,
  identifier: string,
  properties: P,
  admin_description?: string,
  public_description?: string,
};

export type AgeRestrictionsProperties = {
  identifier: string,
  caption: string,
  required?: boolean,
};

export type AgeRestrictionsValue = {
  age_restrictions_description?: string,
  minimum_age?: number,
};

export type EventEmailValue = {
  team_mailing_list_name?: string,
  email?: string,
};

function ageRestrictionsValueIsComplete(value?: AgeRestrictionsValue | null) {
  if (value && typeof value.age_restrictions_description === 'string') {
    return value.age_restrictions_description.trim() !== '';
  }

  return false;
}

function eventEmailValueIsComplete(value?: EventEmailValue | null) {
  if (!value) {
    return false;
  }

  return (value.team_mailing_list_name || value.email);
}

function freeTextValueIsComplete(value?: string | boolean) {
  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  return false;
}

function multipleChoiceValueIsComplete(value?: string | boolean | null) {
  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return false;
}

function registrationPolicyBucketIsComplete(value) {
  if (typeof value !== 'object') {
    return false;
  }

  if (!value.name || !value.description || !value.key) {
    return false;
  }

  return true;
}

function registrationPolicyValueIsComplete(value) {
  if (typeof value !== 'object') {
    return false;
  }

  const policy = value;
  if ((policy.buckets || []).length === 0) {
    return false;
  }

  return policy.buckets.every(registrationPolicyBucketIsComplete);
}

function timeblockPreferenceValueIsComplete(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return false;
}

function timespanValueIsComplete(value) {
  return (typeof value === 'number');
}

export function formResponseValueIsComplete(formItem, value) {
  switch (formItem.item_type) {
    case 'age_restrictions': return ageRestrictionsValueIsComplete(value);
    case 'event_email': return eventEmailValueIsComplete(value);
    case 'free_text': return freeTextValueIsComplete(value);
    case 'multiple_choice': return multipleChoiceValueIsComplete(value);
    case 'registration_policy': return registrationPolicyValueIsComplete(value);
    case 'timeblock_preference': return timeblockPreferenceValueIsComplete(value);
    case 'timespan': return timespanValueIsComplete(value);
    default: return true;
  }
}

export function formResponseValueIsCompleteIfRequired(formItem: APIFormItem<any>, value) {
  if (!formItem.properties.required) {
    return true;
  }

  return formResponseValueIsComplete(formItem, value);
}

export const FormItemPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  form_section_id: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  item_type: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  properties: PropTypes.shape({}).isRequired,
  admin_description: PropTypes.string,
});
