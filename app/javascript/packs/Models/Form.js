import { Map } from 'immutable';
import PropTypes from 'prop-types';

export default class Form {
  static propType = PropTypes.shape({
    properties: PropTypes.object.isRequired,
    formSections: PropTypes.object.isRequired,
    formItems: PropTypes.object.isRequired,
  });

  static fromApiResponse(body) {
    const { form_sections, form_items, ...properties } = body;
    const formSectionsById = Map((form_sections || []).map(section => [section.id, section]));
    const formItemsById = Map(form_items.map(item => [item.id, item]));

    return new Form(Map(properties), formSectionsById, formItemsById);
  }

  constructor(properties, formSections, formItems) {
    this.properties = properties;
    this.formSections = formSections;
    this.formItems = formItems;
  }

  getSections() {
    if (!this._sections) {
      this._sections = this.formSections.valueSeq().sortBy(section => section.position);
    }

    return this._sections;
  }

  getSection(sectionId) {
    return this.formSections.get(sectionId);
  }

  getSectionIndex(sectionId) {
    return this.getSections().indexOf(this.getSection(sectionId));
  }

  getItemsInSection(sectionId) {
    return this.formItems.valueSeq().filter(item => item.form_section_id === sectionId).sortBy(item => item.position);
  }
}