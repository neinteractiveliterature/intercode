import keyBy from 'lodash/keyBy';
import flatMap from 'lodash/flatMap';

import {
  CommonFormFieldsFragment,
  CommonFormItemFieldsFragment,
  CommonFormSectionFieldsFragment,
} from './commonFormFragments.generated';
import { parseTypedFormItemArray, TypedFormItem } from '../FormAdmin/FormItemUtils';

export function sortFormSections<T extends CommonFormSectionFieldsFragment>(
  formSections: T[],
): T[] {
  return [...formSections].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export function sortFormItems<T extends CommonFormItemFieldsFragment>(formItems: T[]): T[] {
  return [...formItems].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export function sortAndParseFormItems(formItems: CommonFormItemFieldsFragment[]): TypedFormItem[] {
  return parseTypedFormItemArray(sortFormItems(formItems));
}

export function getSortedFormSections<T extends CommonFormFieldsFragment>(
  form: T,
): T['form_sections'] {
  return sortFormSections(form.form_sections);
}

export function getSortedFormItems<T extends CommonFormFieldsFragment>(
  form: T,
): T['form_sections'][0]['form_items'] {
  return flatMap(getSortedFormSections(form), (section) => sortFormItems(section.form_items));
}

export function getSortedParsedFormItems(form: CommonFormFieldsFragment): TypedFormItem[] {
  return parseTypedFormItemArray(getSortedFormItems(form));
}

export function getFormItemsByIdentifier(form: CommonFormFieldsFragment): {
  [identifier: string]: CommonFormItemFieldsFragment;
} {
  const indexedSectionItems = form.form_sections.map((formSection) =>
    keyBy(
      formSection.form_items.filter((formItem) => formItem.identifier != null),
      'identifier',
    ),
  );

  return indexedSectionItems.reduce((memo, sectionItems) => ({ ...memo, ...sectionItems }), {});
}
