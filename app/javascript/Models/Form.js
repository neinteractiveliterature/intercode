import PropTypes from 'prop-types';
import keyBy from 'lodash/keyBy';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';

export default class Form {
  static propType = PropTypes.shape({
    properties: PropTypes.object.isRequired,
    formSections: PropTypes.object.isRequired,
    formItems: PropTypes.object.isRequired,
  });

  static fromApiResponse(body) {
    const { form_sections: formSections, form_items: formItems, ...properties } = body;
    const formSectionsById = keyBy(formSections || [], (section) => section.id);
    const formItemsById = keyBy(formItems, (item) => item.id);

    return new Form(properties, formSectionsById, formItemsById);
  }

  constructor(properties, formSections, formItems) {
    this.properties = properties;
    this.formSections = formSections;
    this.formItems = formItems;
  }

  getSections() {
    if (!this.memoizedFormSections) {
      this.memoizedFormSections = [...Object.values(this.formSections)]
        .sort((a, b) => a.position - b.position);
    }

    return this.memoizedFormSections;
  }

  getSection(sectionId) {
    return this.formSections[sectionId];
  }

  getSectionIndex(sectionId) {
    return this.getSections().findIndex((section) => section.id === sectionId);
  }

  getItemsInSection(sectionId) {
    const sectionItems = Object.values(this.formItems)
      .filter((item) => item.form_section_id === sectionId);
    return sectionItems.sort((a, b) => a.position - b.position);
  }

  getAllItems() {
    return flatMap(this.getSections(), (section) => this.getItemsInSection(section.id));
  }

  getItemWithIdentifier(identifier) {
    if (!this.memoizedFormItemsByIdentifier) {
      this.memoizedFormItemsByIdentifier = keyBy(
        compact(Object.values(this.formItems)),
        (item) => item.identifier,
      );
    }

    return this.memoizedFormItemsByIdentifier[identifier];
  }
}
