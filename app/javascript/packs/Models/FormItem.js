// @flow

import { Record } from 'immutable';
import PropTypes from 'prop-types';
import RegistrationPolicy from './RegistrationPolicy';

type FormItemAPIRepresentation = {
  id?: number,
  form_section_id?: number,
  position?: number,
  item_type?: string,
  identifier?: string,
};

const defaultProperties: {
  id: number | null,
  formSectionId: number | null,
  position: number | null,
  itemType: string | null,
  identifier: string | null,
  properties: {},
} = {
  id: null,
  formSectionId: null,
  position: null,
  itemType: null,
  identifier: null,
  properties: {},
};

export default class FormItem extends Record(defaultProperties) {
  static propType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    form_section_id: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    item_type: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  });

  static fromAPI(body: FormItemAPIRepresentation) {
    return new FormItem().setAttributesFromAPI(body);
  }

  setAttributesFromAPI(json: FormItemAPIRepresentation): FormItem {
    const {
      id,
      form_section_id: formSectionId,
      position,
      item_type: itemType,
      identifier,
      ...properties
    } = json;

    let returnRecord = this.set('properties', {
      ...this.get('properties'),
      ...properties,
    });

    if (json.id !== undefined) {
      returnRecord = returnRecord.set('id', json.id);
    }

    if (json.form_section_id !== undefined) {
      returnRecord = returnRecord.set('formSectionId', json.form_section_id);
    }

    if (json.position !== undefined) {
      returnRecord = returnRecord.set('position', json.position);
    }

    if (json.item_type !== undefined) {
      returnRecord = returnRecord.set('itemType', json.item_type);
    }

    if (json.identifier !== undefined) {
      returnRecord = returnRecord.set('identifier', json.identifier);
    }

    return returnRecord;
  }

  valueIsComplete(value: any): boolean {
    switch (this.itemType) {
      case 'free_text':
        if (typeof value === 'string') {
          return value.trim() !== '';
        }

        return false;

      case 'multiple_choice':
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'boolean') {
          return true;
        }

        return false;

      case 'registration_policy':
        if (typeof value === 'object') {
          const policy = RegistrationPolicy.fromAPI(value);
          return policy.buckets.every((bucket) => {
            if (!bucket.name || !bucket.description || !bucket.key) {
              return false;
            }

            if (
              bucket.slotsLimited && !(
                typeof bucket.minimumSlots === 'number' &&
                typeof bucket.preferredSlots === 'number' &&
                typeof bucket.totalSlots === 'number'
              )
            ) {
              return false;
            }

            return true;
          });
        }

        return false;

      case 'timeblock_preference':
        if (Array.isArray(value)) {
          return value.length > 0;
        }

        return false;

      case 'timespan':
        return (typeof value === 'number');

      default:
        return true;
    }
  }
}
