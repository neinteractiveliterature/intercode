/* eslint-disable @typescript-eslint/no-explicit-any */
import { assertNever } from 'assert-never';

import { TypedFormItem } from '../FormAdmin/FormItemUtils';

function ageRestrictionsValueIsComplete(value?: any) {
  const description = value?.age_restrictions_description;

  if (typeof description === 'string') {
    return description.trim() !== '';
  }

  return false;
}

function dateValueIsComplete(value?: any) {
  return value != null;
}

function eventEmailValueIsComplete(value?: any) {
  if (!value) {
    return false;
  }

  return !!(value?.team_mailing_list_name || value?.email);
}

function freeTextValueIsComplete(value?: any) {
  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  return false;
}

function multipleChoiceValueIsComplete(value?: any) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return false;
}

function registrationPolicyBucketIsComplete(value?: any) {
  if (typeof value !== 'object' || !value) {
    return false;
  }

  if (!value.name || !value.description || !value.key) {
    return false;
  }

  return true;
}

function registrationPolicyValueIsComplete(value?: any) {
  if (typeof value !== 'object' || !value) {
    return false;
  }

  const policy = value;
  if ((policy.buckets || []).length === 0) {
    return false;
  }

  return policy.buckets.every(registrationPolicyBucketIsComplete);
}

function timeblockPreferenceValueIsComplete(value?: any) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return false;
}

function timespanValueIsComplete(value?: any) {
  return typeof value === 'number';
}

export function formResponseValueIsComplete(
  formItem: TypedFormItem,
  value: any | null | undefined,
): boolean {
  switch (formItem.item_type) {
    case 'age_restrictions':
      return ageRestrictionsValueIsComplete(value);
    case 'date':
      return dateValueIsComplete(value);
    case 'event_email':
      return eventEmailValueIsComplete(value);
    case 'free_text':
      return freeTextValueIsComplete(value);
    case 'multiple_choice':
      return multipleChoiceValueIsComplete(value);
    case 'registration_policy':
      return registrationPolicyValueIsComplete(value);
    case 'static_text':
      return true;
    case 'timeblock_preference':
      return timeblockPreferenceValueIsComplete(value);
    case 'timespan':
      return timespanValueIsComplete(value);
    default:
      assertNever(formItem, true);
      return true;
  }
}

export function formResponseValueIsCompleteIfRequired(
  formItem: TypedFormItem,
  value: any | null | undefined,
): boolean {
  if (formItem.item_type === 'static_text') {
    return true;
  }

  if (!formItem.rendered_properties.required) {
    return true;
  }

  return formResponseValueIsComplete(formItem, value);
}
