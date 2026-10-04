import { InMemoryCache } from '@apollo/client';
import { Mock, vi } from 'vitest';
import {
  FORM_ITEM_ROLES,
  addGeneratedIds,
  buildFormItemInput,
  castValueForFormItemType,
  findStandardItem,
  formItemPropertyUpdater,
  formItemVisibleTo,
  formItemWriteableBy,
  highestLevelRole,
  mutationUpdaterForFormSection,
  parseFormItemObject,
  parseTypedFormItemArray,
  parseTypedFormItemObject,
  removeGeneratedIds,
  roleIsAtLeast,
  valueIsAgeRestrictionsValue,
  valueIsDateItemValue,
  valueIsEventEmailValue,
  valueIsFreeTextValue,
  valueIsMultipleChoiceValue,
  valueIsRegistrationPolicyValue,
  valueIsTimeblockPreferenceValue,
  valueIsTimespanValue,
  valueIsValidForFormItemType,
  TypedFormItem,
} from '../../../app/javascript/FormAdmin/FormItemUtils';
import {
  FormEditorFormItemFieldsFragment,
  FormEditorQueryData,
  FormEditorQueryDocument,
} from '../../../app/javascript/FormAdmin/queries.generated';
import { FormItemExposeIn, FormItemRole, FormType, TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';
import { CommonFormItemFieldsFragment } from '../../../app/javascript/Models/commonFormFragments.generated';
import FormTypes from '../../../config/form_types.json';

const warning: Mock = vi.hoisted(() => vi.fn());
vi.mock('ErrorReporting', () => ({ default: () => ({ warning }) }));

function fragment(overrides: Partial<FormEditorFormItemFieldsFragment> = {}): FormEditorFormItemFieldsFragment {
  return {
    __typename: 'FormItem',
    id: 'item-1',
    position: 1,
    identifier: 'question',
    item_type: 'free_text',
    properties: '{}',
    rendered_properties: '{"caption":"Rendered"}',
    default_value: null,
    visibility: FormItemRole.Normal,
    writeability: FormItemRole.Normal,
    expose_in: null,
    admin_description: null,
    public_description: null,
    ...overrides,
  };
}

function typedItem(itemType: string, properties: Record<string, unknown> = {}): TypedFormItem {
  const item = parseTypedFormItemObject(
    fragment({ item_type: itemType, properties: JSON.stringify(properties), identifier: 'question' }),
  );
  if (!item) {
    throw new Error(`couldn't build a ${itemType} form item`);
  }
  return item;
}

describe('FormItemUtils', () => {
  beforeEach(() => {
    warning.mockClear();
  });

  describe('roles', () => {
    it('ranks roles from lowest to highest', () => {
      expect(roleIsAtLeast(FormItemRole.Admin, FormItemRole.Normal)).toBe(true);
      expect(roleIsAtLeast(FormItemRole.Admin, FormItemRole.Admin)).toBe(true);
      expect(roleIsAtLeast(FormItemRole.TeamMember, FormItemRole.ConfirmedAttendee)).toBe(true);
      expect(roleIsAtLeast(FormItemRole.Normal, FormItemRole.ConfirmedAttendee)).toBe(false);
      expect(roleIsAtLeast(FormItemRole.AllProfilesBasicAccess, FormItemRole.Admin)).toBe(false);
    });

    it('finds the highest role in a list, defaulting to normal', () => {
      expect(highestLevelRole([FormItemRole.Normal, FormItemRole.TeamMember, FormItemRole.ConfirmedAttendee])).toBe(
        FormItemRole.TeamMember,
      );
      expect(highestLevelRole([FormItemRole.Admin, FormItemRole.Normal])).toBe(FormItemRole.Admin);
      expect(highestLevelRole([])).toBe(FormItemRole.Normal);
    });

    it('does not change the global role ordering when finding the highest role', () => {
      const before = [...FORM_ITEM_ROLES];

      highestLevelRole([FormItemRole.TeamMember]);
      highestLevelRole([FormItemRole.Admin]);
      highestLevelRole([FormItemRole.Normal]);

      expect(FORM_ITEM_ROLES).toEqual(before);
      expect(roleIsAtLeast(FormItemRole.Admin, FormItemRole.Normal)).toBe(true);
      expect(formItemVisibleTo({ visibility: FormItemRole.Admin }, FormItemRole.Normal)).toBe(false);
    });

    it('shows an item to roles at or above its visibility', () => {
      const item = { visibility: FormItemRole.TeamMember };

      expect(formItemVisibleTo(item, FormItemRole.Normal)).toBe(false);
      expect(formItemVisibleTo(item, FormItemRole.ConfirmedAttendee)).toBe(false);
      expect(formItemVisibleTo(item, FormItemRole.TeamMember)).toBe(true);
      expect(formItemVisibleTo(item, FormItemRole.Admin)).toBe(true);
    });

    it('only lets roles that can see an item, and meet its writeability, write to it', () => {
      const item = { visibility: FormItemRole.ConfirmedAttendee, writeability: FormItemRole.TeamMember };

      expect(formItemWriteableBy(item, FormItemRole.Normal)).toBe(false);
      expect(formItemWriteableBy(item, FormItemRole.ConfirmedAttendee)).toBe(false);
      expect(formItemWriteableBy(item, FormItemRole.TeamMember)).toBe(true);
      expect(formItemWriteableBy(item, FormItemRole.Admin)).toBe(true);
    });

    it('does not let a role write to an item it cannot see, even if its writeability is lower', () => {
      const item = { visibility: FormItemRole.Admin, writeability: FormItemRole.Normal };

      expect(formItemWriteableBy(item, FormItemRole.TeamMember)).toBe(false);
      expect(formItemWriteableBy(item, FormItemRole.Admin)).toBe(true);
    });
  });

  describe('value type guards', () => {
    it('accepts any object as an age restrictions value, but not other things', () => {
      expect(valueIsAgeRestrictionsValue({})).toBe(true);
      expect(valueIsAgeRestrictionsValue({ minimum_age: 18 })).toBe(true);
      expect(valueIsAgeRestrictionsValue(null)).toBe(false);
      expect(valueIsAgeRestrictionsValue('18+')).toBe(false);
    });

    it('accepts any object as an event email value, but not other things', () => {
      expect(valueIsEventEmailValue({ email: 'a@example.com' })).toBe(true);
      expect(valueIsEventEmailValue(null)).toBe(false);
      expect(valueIsEventEmailValue('a@example.com')).toBe(false);
    });

    it('accepts strings for dates and free text, and numbers for timespans', () => {
      expect(valueIsDateItemValue('2026-01-01')).toBe(true);
      expect(valueIsDateItemValue(20260101)).toBe(false);
      expect(valueIsFreeTextValue('hello')).toBe(true);
      expect(valueIsFreeTextValue(['hello'])).toBe(false);
      expect(valueIsTimespanValue(3600)).toBe(true);
      expect(valueIsTimespanValue('3600')).toBe(false);
    });

    it('accepts strings, booleans and arrays of them for multiple choice', () => {
      expect(valueIsMultipleChoiceValue('a')).toBe(true);
      expect(valueIsMultipleChoiceValue(true)).toBe(true);
      expect(valueIsMultipleChoiceValue(['a', true])).toBe(true);
      expect(valueIsMultipleChoiceValue([])).toBe(true);
      expect(valueIsMultipleChoiceValue(['a', 1])).toBe(false);
      expect(valueIsMultipleChoiceValue(5)).toBe(false);
      expect(valueIsMultipleChoiceValue(null)).toBe(false);
    });

    it('requires a buckets array for registration policies', () => {
      expect(valueIsRegistrationPolicyValue({ buckets: [] })).toBe(true);
      expect(valueIsRegistrationPolicyValue({ buckets: 'nope' })).toBe(false);
      expect(valueIsRegistrationPolicyValue({})).toBe(false);
      expect(valueIsRegistrationPolicyValue(null)).toBe(false);
      expect(valueIsRegistrationPolicyValue('buckets')).toBe(false);
    });

    it('requires every timeblock preference to have string start, finish, label and ordinality', () => {
      const preference = { start: '10:00', finish: '12:00', label: 'Morning', ordinality: '1' };

      expect(valueIsTimeblockPreferenceValue([preference])).toBe(true);
      expect(valueIsTimeblockPreferenceValue([])).toBe(true);
      expect(valueIsTimeblockPreferenceValue([preference, { ...preference, ordinality: 1 }])).toBe(false);
      expect(valueIsTimeblockPreferenceValue([{ start: '10:00' }])).toBe(false);
      expect(valueIsTimeblockPreferenceValue(preference)).toBe(false);
      expect(valueIsTimeblockPreferenceValue(null)).toBe(false);
    });
  });

  describe('valueIsValidForFormItemType', () => {
    it.each([
      ['age_restrictions', { minimum_age: 18 }, 'text'],
      ['date', '2026-01-01', 5],
      ['event_email', { email: 'a@example.com' }, 'a@example.com'],
      ['free_text', 'hello', 5],
      ['multiple_choice', 'a', 5],
      ['registration_policy', { buckets: [] }, 'nope'],
      ['timeblock_preference', [], 'nope'],
      ['timespan', 3600, 'nope'],
    ])('checks values for %s items', (itemType, validValue, invalidValue) => {
      const item = typedItem(itemType);

      expect(valueIsValidForFormItemType(item, validValue)).toBe(true);
      expect(valueIsValidForFormItemType(item, invalidValue)).toBe(false);
    });

    it('never accepts a value for static text, which has none', () => {
      expect(valueIsValidForFormItemType(typedItem('static_text', { content: 'hi', style: 'normal' }), 'hi')).toBe(
        false,
      );
    });
  });

  describe('castValueForFormItemType', () => {
    it('returns valid values unchanged', () => {
      expect(castValueForFormItemType(typedItem('free_text'), 'hello')).toBe('hello');
    });

    it('passes booleans through for multiple choice items, since they are valid values', () => {
      // (so castValueForFormItemType's boolean-to-string conversion for multiple choice is never reached)
      const radio = typedItem('multiple_choice', { style: 'radio_vertical', choices: [] });
      const checkbox = typedItem('multiple_choice', { style: 'checkbox_vertical', choices: [] });

      expect(castValueForFormItemType(radio, true)).toBe(true);
      expect(castValueForFormItemType(checkbox, false)).toBe(false);
    });

    it('returns undefined for values that do not fit the item type', () => {
      expect(castValueForFormItemType(typedItem('free_text'), 5)).toBeUndefined();
      expect(castValueForFormItemType(typedItem('timespan'), 'soon')).toBeUndefined();
    });
  });

  describe('parseFormItemObject', () => {
    it('parses the JSON in default_value, properties and rendered_properties', () => {
      const parsed = parseFormItemObject<{ caption: string }, string>(
        fragment({
          default_value: '"a default"',
          properties: '{"caption":"Caption"}',
          rendered_properties: '{"caption":"Rendered caption"}',
        }),
      );

      expect(parsed.default_value).toBe('a default');
      expect(parsed.properties).toEqual({ caption: 'Caption' });
      expect(parsed.rendered_properties).toEqual({ caption: 'Rendered caption' });
    });

    it('leaves default_value undefined when there is none', () => {
      expect(parseFormItemObject(fragment({ default_value: null })).default_value).toBeUndefined();
    });

    it('only has rendered properties for fragments that did not ask for the raw ones', () => {
      const commonFields: CommonFormItemFieldsFragment = {
        __typename: 'FormItem',
        id: 'item-1',
        position: 1,
        identifier: 'question',
        item_type: 'free_text',
        rendered_properties: '{"caption":"Rendered"}',
        default_value: null,
        visibility: FormItemRole.Normal,
        writeability: FormItemRole.Normal,
        expose_in: [FormItemExposeIn.EventCatalog],
      };

      const parsed = parseFormItemObject(commonFields);

      expect(parsed.rendered_properties).toEqual({ caption: 'Rendered' });
      expect(parsed).not.toHaveProperty('properties');
      expect(parsed.expose_in).toEqual([FormItemExposeIn.EventCatalog]);
    });
  });

  describe('parseTypedFormItemObject and parseTypedFormItemArray', () => {
    it('returns items of known types', () => {
      expect(parseTypedFormItemObject(fragment({ item_type: 'timespan', properties: '{}' }))?.item_type).toBe(
        'timespan',
      );
    });

    it('warns about and drops items of unknown types', () => {
      const result = parseTypedFormItemObject(fragment({ id: 'mystery', item_type: 'hologram', properties: '{}' }));

      expect(result).toBeUndefined();
      expect(warning).toHaveBeenCalledWith('Form item mystery has unknown type hologram, ignoring');
    });

    it('keeps only the known items in an array, in order', () => {
      const items = parseTypedFormItemArray([
        fragment({ id: 'a', item_type: 'date', properties: '{}' }),
        fragment({ id: 'b', item_type: 'hologram', properties: '{}' }),
        fragment({ id: 'c', item_type: 'free_text', properties: '{}' }),
      ]);

      expect(items.map((item) => item.id)).toEqual(['a', 'c']);
    });
  });

  describe('generated IDs', () => {
    const properties = {
      caption: 'Pick',
      choices: [
        { caption: 'A', value: 'a' },
        { caption: 'B', value: 'b' },
      ],
      presets: [{ name: 'Standard' }],
      timeblocks: [{ label: 'Morning' }],
      omit_timeblocks: [{ label: 'Lunch' }],
    };

    it('gives each item in the choices, presets, timeblocks and omit_timeblocks arrays a unique generatedId', () => {
      const withIds = addGeneratedIds(properties);

      const ids = [
        ...withIds.choices.map((choice) => choice.generatedId),
        ...withIds.presets.map((preset) => preset.generatedId),
        ...withIds.timeblocks.map((timeblock) => timeblock.generatedId),
        ...withIds.omit_timeblocks.map((omission) => omission.generatedId),
      ];
      expect(ids).toHaveLength(5);
      expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
      expect(new Set(ids).size).toBe(5);
      expect(withIds.choices[0]).toMatchObject({ caption: 'A', value: 'a' });
      expect(withIds.caption).toBe('Pick');
    });

    it('leaves other properties, and properties without those arrays, alone', () => {
      expect(addGeneratedIds({ caption: 'Just a caption' })).toEqual({ caption: 'Just a caption' });
    });

    it('removes the generated IDs again', () => {
      expect(removeGeneratedIds(addGeneratedIds(properties))).toEqual(properties);
    });

    it('treats missing properties as undefined when removing IDs', () => {
      expect(removeGeneratedIds(null)).toBeUndefined();
      expect(removeGeneratedIds(undefined)).toBeUndefined();
    });
  });

  describe('buildFormItemInput', () => {
    type PickProperties = { caption: string; choices: { caption: string; value: string }[] };

    it('builds the mutation input, stringifying the default value and properties without generated IDs', () => {
      const properties = addGeneratedIds<PickProperties>({ caption: 'Pick', choices: [{ caption: 'A', value: 'a' }] });
      const item = {
        ...parseFormItemObject<PickProperties, unknown>(
          fragment({ admin_description: 'For admins', public_description: 'For everyone' }),
        ),
        default_value: { buckets: [] },
        properties,
        rendered_properties: properties,
      };

      expect(buildFormItemInput(item)).toEqual({
        identifier: 'question',
        item_type: 'free_text',
        admin_description: 'For admins',
        public_description: 'For everyone',
        default_value: '{"buckets":[]}',
        properties: '{"caption":"Pick","choices":[{"caption":"A","value":"a"}]}',
        visibility: FormItemRole.Normal,
        writeability: FormItemRole.Normal,
        expose_in: null,
      });
    });

    it('uses a null default value when there is none', () => {
      const properties = addGeneratedIds<PickProperties>({ caption: 'x', choices: [] });
      const item = {
        ...parseFormItemObject<PickProperties, unknown>(fragment()),
        properties,
        rendered_properties: properties,
      };

      expect(buildFormItemInput(item).default_value).toBeNull();
    });
  });

  describe('formItemPropertyUpdater', () => {
    it('updates one property of the form item through the setter, keeping the rest', () => {
      const item = {
        ...parseFormItemObject<Record<string, unknown>, string>(fragment()),
        properties: { caption: 'Old', lines: 1 },
      };
      let state = item;
      const setState = (update: React.SetStateAction<typeof item>) => {
        state = typeof update === 'function' ? update(state) : update;
      };

      formItemPropertyUpdater<Record<string, unknown>, typeof item, 'caption'>('caption', setState)('New');

      expect(state.properties).toEqual({ caption: 'New', lines: 1 });
      expect(state.identifier).toBe('question');
    });
  });

  describe('findStandardItem', () => {
    it('finds a standard item for the form type and includes its identifier', () => {
      const item = findStandardItem(FormTypes.event, 'title');

      expect(item).toMatchObject({ identifier: 'title' });
      expect(item?.description).toBeTruthy();
    });

    it('is undefined for unknown identifiers or missing arguments', () => {
      expect(findStandardItem(FormTypes.event, 'not_a_standard_item')).toBeUndefined();
      expect(findStandardItem(FormTypes.event, null)).toBeUndefined();
      expect(findStandardItem(FormTypes.event, '')).toBeUndefined();
      expect(findStandardItem(undefined, 'title')).toBeUndefined();
    });
  });

  describe('mutationUpdaterForFormSection', () => {
    function sectionData(
      id: string,
      title: string,
    ): FormEditorQueryData['convention']['form']['form_sections'][number] {
      return { __typename: 'FormSection', id, title, position: 1, form_items: [] };
    }

    const queryData: FormEditorQueryData = {
      __typename: 'Query',
      convention: {
        __typename: 'Convention',
        id: 'convention-1',
        name: 'Test Con',
        starts_at: null,
        ends_at: null,
        timezone_name: null,
        timezone_mode: TimezoneMode.ConventionLocal,
        event_mailing_list_domain: null,
        form: {
          __typename: 'Form',
          id: 'form-1',
          title: 'A form',
          form_type: FormType.Event,
          form_sections: [sectionData('s1', 'First'), sectionData('s2', 'Second')],
        },
      },
    };

    it('applies the updater to just the one section, using the mutation result', () => {
      const cache = new InMemoryCache();
      vi.spyOn(cache, 'readQuery').mockReturnValue(queryData);
      const writeQuery = vi.spyOn(cache, 'writeQuery').mockReturnValue(undefined);
      const updater = vi.fn((section: ReturnType<typeof sectionData>, result: string) => ({
        ...section,
        title: `${section.title} ${result}`,
      }));

      mutationUpdaterForFormSection('form-1', 's2', updater)(cache, 'updated');

      expect(updater).toHaveBeenCalledTimes(1);
      expect(writeQuery).toHaveBeenCalledTimes(1);
      const written = writeQuery.mock.calls[0][0];
      expect(written.query).toBe(FormEditorQueryDocument);
      expect(written.variables).toEqual({ id: 'form-1' });
      expect(written.data).toMatchObject({
        convention: { form: { form_sections: [{ title: 'First' }, { title: 'Second updated' }] } },
      });
    });

    it('does nothing without a section ID', () => {
      const cache = new InMemoryCache();
      const readQuery = vi.spyOn(cache, 'readQuery');
      const writeQuery = vi.spyOn(cache, 'writeQuery');

      mutationUpdaterForFormSection('form-1', undefined, (section) => section)(cache, 'ignored');

      expect(readQuery).not.toHaveBeenCalled();
      expect(writeQuery).not.toHaveBeenCalled();
    });

    it('does nothing if the form is not in the cache', () => {
      const cache = new InMemoryCache();
      vi.spyOn(cache, 'readQuery').mockReturnValue(null);
      const writeQuery = vi.spyOn(cache, 'writeQuery');

      mutationUpdaterForFormSection('form-1', 's1', (section) => section)(cache, 'ignored');

      expect(writeQuery).not.toHaveBeenCalled();
    });
  });
});
