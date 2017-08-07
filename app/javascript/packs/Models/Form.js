// @flow

import { Map, IndexedSeq } from 'immutable';
import PropTypes from 'prop-types';

type FormItem = {
  id: number,
  form_section_id: number,
  position: number,
  item_type: string,
  identifier?: string,
  properties: {},
};

type FormSection = {
  id: number,
  title: string,
  position: number,
};

export default class Form {
  static propType = PropTypes.shape({
    properties: PropTypes.object.isRequired,
    formSections: PropTypes.object.isRequired,
    formItems: PropTypes.object.isRequired,
  });

  static fromApiResponse(body) {
    const { form_sections: formSections, form_items: formItems, ...properties } = body;
    const formSectionsById = Map((formSections || []).map(section => [section.id, section]));
    const formItemsById = Map(formItems.map(item => [item.id, item]));

    return new Form(Map(properties), formSectionsById, formItemsById);
  }

  properties: any;
  formSections: Map<number, FormSection>;
  formItems: Map<number, FormItem>;
  _sections: IndexedSeq<any>;

  constructor(
    properties: any,
    formSections: Map<number, FormSection>,
    formItems: Map<number, FormItem>,
  ) {
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

  getSection(sectionId: number) {
    return this.formSections.get(sectionId);
  }

  getSectionIndex(sectionId: number): number {
    return this.getSections().indexOf(this.getSection(sectionId));
  }

  getItemsInSection(sectionId: number) {
    return this.formItems.valueSeq().filter(
      item => item.form_section_id === sectionId,
    ).sortBy(item => item.position);
  }

  getAllItems() {
    return this.formSections.keySeq().flatMap(sectionId => this.getItemsInSection(sectionId));
  }
}
