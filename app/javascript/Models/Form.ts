import PropTypes from 'prop-types';
import keyBy from 'lodash/keyBy';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';

import { FormSection } from '../graphqlTypes.generated';
import { APIFormItem } from './FormItem';
import {
  CommonFormFieldsFragment, CommonFormItemFieldsFragment,
} from './commonFormFragments.generated';

export function getSortedFormSections<T extends CommonFormFieldsFragment>(
  form: T,
): T['form_sections'] {
  return [...form.form_sections].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export function getSortedFormItems<T extends CommonFormFieldsFragment>(
  form: T,
): T['form_sections'][0]['form_items'] {
  return flatMap(getSortedFormSections(form), (section) => [...section.form_items]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)));
}

export function getFormItemsByIdentifier(
  form: CommonFormFieldsFragment,
): { [identifier: string]: CommonFormItemFieldsFragment } {
  const indexedSectionItems = form.form_sections.map((formSection) => keyBy(
    formSection.form_items.filter((formItem) => formItem.identifier != null),
    'identifier',
  ));

  return indexedSectionItems.reduce((memo, sectionItems) => ({ ...memo, ...sectionItems }), {});
}

export default class Form {
  static propType = PropTypes.shape({
    properties: PropTypes.object.isRequired,
    formSections: PropTypes.object.isRequired,
    formItems: PropTypes.object.isRequired,
  });

  properties: {};

  formSections: {
    [id: string]: FormSection,
  };

  formItems: {
    [id: string]: APIFormItem<any>,
  };

  memoizedFormSections: FormSection[];

  memoizedFormItemsByIdentifier: {
    [identifier: string]: APIFormItem<any>,
  };

  static fromApiResponse(body: {
    form_sections: FormSection[],
    form_items: APIFormItem<any>[],
  }) {
    const { form_sections: formSections, form_items: formItems, ...properties } = body;
    const formSectionsById = keyBy(formSections || [], (section) => section.id);
    const formItemsById = keyBy(formItems, (item) => item.id);

    return new Form(properties, formSectionsById, formItemsById);
  }

  constructor(
    properties: {},
    formSections: typeof Form.prototype['formSections'],
    formItems: typeof Form.prototype['formItems'],
  ) {
    this.properties = properties;
    this.formSections = formSections;
    this.formItems = formItems;
  }

  getSections() {
    if (!this.memoizedFormSections) {
      this.memoizedFormSections = [...Object.values(this.formSections)]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }

    return this.memoizedFormSections;
  }

  getSection(sectionId: number) {
    return this.formSections[sectionId];
  }

  getSectionIndex(sectionId: number) {
    return this.getSections().findIndex((section) => section.id === sectionId);
  }

  getItemsInSection(sectionId: number) {
    const sectionItems = Object.values(this.formItems)
      .filter((item) => item.form_section_id === sectionId);
    return sectionItems.sort((a, b) => a.position - b.position);
  }

  getAllItems() {
    return flatMap(this.getSections(), (section) => this.getItemsInSection(section.id));
  }

  getItemWithIdentifier(identifier: string) {
    if (!this.memoizedFormItemsByIdentifier) {
      this.memoizedFormItemsByIdentifier = keyBy(
        compact(Object.values(this.formItems)),
        (item) => item.identifier,
      );
    }

    return this.memoizedFormItemsByIdentifier[identifier];
  }
}
