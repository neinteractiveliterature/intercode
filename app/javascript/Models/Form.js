import { Map } from 'immutable';
import PropTypes from 'prop-types';
import FormItem from './FormItem';

export default class Form {
  static propType = PropTypes.shape({
    properties: PropTypes.object.isRequired,
    formSections: PropTypes.object.isRequired,
    formItems: PropTypes.object.isRequired,
  });

  static fromApiResponse(body) {
    const { form_sections: formSections, form_items: formItems, ...properties } = body;
    const formSectionsById = Map((formSections || []).map(section => [section.id, section]));
    const formItemsById = Map(formItems.map(item => [item.id, FormItem.fromAPI(item)]));

    return new Form(Map(properties), formSectionsById, formItemsById);
  }

  constructor(properties, formSections, formItems) {
    this.properties = properties;
    this.formSections = formSections;
    this.formItems = formItems;
  }

  getSections() {
    if (!this.memoizedFormSections) {
      this.memoizedFormSections = this.formSections.valueSeq().sortBy(section => section.position);
    }

    return this.memoizedFormSections;
  }

  getSection(sectionId) {
    return this.formSections.get(sectionId);
  }

  getSectionIndex(sectionId) {
    return this.getSections().indexOf(this.getSection(sectionId));
  }

  getItemsInSection(sectionId) {
    const sectionItems = this.formItems.valueSeq().filter(item => item.formSectionId === sectionId);
    return sectionItems.sortBy(item => item.position);
  }

  getAllItems() {
    return this.formSections.keySeq().flatMap(sectionId => this.getItemsInSection(sectionId));
  }
}
