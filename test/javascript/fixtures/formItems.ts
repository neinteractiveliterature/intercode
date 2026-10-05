import {
  AgeRestrictionsFormItem,
  DateFormItem,
  EventEmailFormItem,
  FreeTextFormItem,
  MultipleChoiceFormItem,
  RegistrationPolicyFormItem,
  StaticTextFormItem,
  TimeblockPreferenceFormItem,
  TimespanFormItem,
} from '../../../app/javascript/FormAdmin/FormItemUtils';
import { FormItemRole } from '../../../app/javascript/graphqlTypes.generated';

const commonFields = (identifier: string) => ({
  __typename: 'FormItem' as const,
  id: `item-${identifier}`,
  admin_description: null,
  public_description: null,
  position: 1,
  identifier,
  visibility: FormItemRole.Normal,
  writeability: FormItemRole.Normal,
  expose_in: null,
});

type Common = { identifier?: string; visibility?: FormItemRole };

export function buildFreeTextItem({
  identifier = 'description',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<FreeTextFormItem['rendered_properties']> = {}): FreeTextFormItem {
  const rendered_properties: FreeTextFormItem['rendered_properties'] = {
    identifier,
    caption: 'Description',
    lines: 1,
    free_text_type: 'text',
    format: 'text',
    ...properties,
  };
  return {
    ...commonFields(identifier),
    item_type: 'free_text',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildMultipleChoiceItem({
  identifier = 'favorite_color',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<MultipleChoiceFormItem['rendered_properties']> = {}): MultipleChoiceFormItem {
  const rendered_properties: MultipleChoiceFormItem['rendered_properties'] = {
    identifier,
    caption: 'Favorite color',
    style: 'radio_vertical',
    choices: [
      { caption: 'Red', value: 'red' },
      { caption: 'Green', value: 'green' },
      { caption: 'Blue', value: 'blue' },
    ],
    ...properties,
  };
  return {
    ...commonFields(identifier),
    item_type: 'multiple_choice',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildDateItem({
  identifier = 'birthday',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<DateFormItem['rendered_properties']> = {}): DateFormItem {
  const rendered_properties: DateFormItem['rendered_properties'] = { identifier, caption: 'Birthday', ...properties };
  return {
    ...commonFields(identifier),
    item_type: 'date',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildTimespanItem({
  identifier = 'length',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<TimespanFormItem['rendered_properties']> = {}): TimespanFormItem {
  const rendered_properties: TimespanFormItem['rendered_properties'] = {
    identifier,
    caption: 'Length',
    ...properties,
  };
  return {
    ...commonFields(identifier),
    item_type: 'timespan',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildAgeRestrictionsItem({
  identifier = 'age_restrictions',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<AgeRestrictionsFormItem['rendered_properties']> = {}): AgeRestrictionsFormItem {
  const rendered_properties: AgeRestrictionsFormItem['rendered_properties'] = {
    identifier,
    caption: 'Age restrictions',
    ...properties,
  };
  return {
    ...commonFields(identifier),
    item_type: 'age_restrictions',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildEventEmailItem({
  identifier = 'email',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<EventEmailFormItem['rendered_properties']> = {}): EventEmailFormItem {
  const rendered_properties: EventEmailFormItem['rendered_properties'] = { identifier, ...properties };
  return {
    ...commonFields(identifier),
    item_type: 'event_email',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildTimeblockPreferenceItem({
  identifier = 'timeblock_preference',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<TimeblockPreferenceFormItem['rendered_properties']> = {}): TimeblockPreferenceFormItem {
  const rendered_properties: TimeblockPreferenceFormItem['rendered_properties'] = {
    identifier,
    caption: 'When can you play?',
    timeblocks: [],
    omit_timeblocks: [],
    ...properties,
  };
  return {
    ...commonFields(identifier),
    item_type: 'timeblock_preference',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildStaticTextItem(
  properties: Partial<StaticTextFormItem['rendered_properties']> = {},
): StaticTextFormItem {
  const rendered_properties: StaticTextFormItem['rendered_properties'] = {
    content: '<p>Some words</p>',
    style: 'normal',
    ...properties,
  };
  return {
    ...commonFields('static'),
    item_type: 'static_text',
    visibility: FormItemRole.Normal,
    properties: rendered_properties,
    rendered_properties,
  };
}

export function buildRegistrationPolicyItem({
  identifier = 'registration_policy',
  visibility = FormItemRole.Normal,
  ...properties
}: Common & Partial<RegistrationPolicyFormItem['rendered_properties']> = {}): RegistrationPolicyFormItem {
  const rendered_properties: RegistrationPolicyFormItem['rendered_properties'] = {
    identifier,
    presets: [],
    allow_custom: true,
    ...properties,
  };
  return {
    ...commonFields(identifier),
    item_type: 'registration_policy',
    visibility,
    properties: rendered_properties,
    rendered_properties,
  };
}
