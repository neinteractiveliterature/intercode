import { Record } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

const defaultProperties = {
  key: null,
  name: null,
  description: null,
  totalSlots: null,
  minimumSlots: null,
  preferredSlots: null,
  slotsLimited: false,
  anything: false,
  notCounted: false,
};

const fieldPropTypes = {
  key: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  totalSlots: PropTypes.number,
  minimumSlots: PropTypes.number,
  preferredSlots: PropTypes.number,
  slotsLimited: PropTypes.bool,
  anything: PropTypes.bool,
  notCounted: PropTypes.bool,
};

export default class RegistrationPolicyBucket extends Record(defaultProperties) {
  static propType = ImmutablePropTypes.recordOf(fieldPropTypes);
  static apiRepresentationPropType = PropTypes.shape(fieldPropTypes);

  static fromAPI(json) {
    return new RegistrationPolicyBucket().setAttributesFromAPI(json);
  }

  setAttributesFromAPI(json) {
    let returnRecord = this;

    if (json.key !== undefined) {
      returnRecord = returnRecord.set('key', json.key);
    }

    if (json.name !== undefined) {
      returnRecord = returnRecord.set('name', json.name);
    }

    if (json.description !== undefined) {
      returnRecord = returnRecord.set('description', json.description);
    }

    if (json.minimum_slots !== undefined) {
      returnRecord = returnRecord.setMinimumSlots(json.minimum_slots);
    }

    if (json.preferred_slots !== undefined) {
      returnRecord = returnRecord.setPreferredSlots(json.preferred_slots);
    }

    if (json.total_slots !== undefined) {
      returnRecord = returnRecord.setTotalSlots(json.total_slots);
    }

    if (json.slots_limited !== undefined) {
      returnRecord = returnRecord.setSlotsLimited(json.slots_limited);
    }

    if (json.anything !== undefined) {
      returnRecord = returnRecord.set('anything', json.anything);
    }

    if (json.not_counted !== undefined) {
      returnRecord = returnRecord.set('notCounted', json.not_counted);
    }

    return returnRecord;
  }

  getAPIRepresentation() {
    return {
      key: this.get('key'),
      name: this.get('name'),
      description: this.get('description'),
      total_slots: this.get('totalSlots'),
      minimum_slots: this.get('minimumSlots'),
      preferred_slots: this.get('preferredSlots'),
      slots_limited: this.get('slotsLimited'),
      anything: this.get('anything'),
      not_counted: this.get('notCounted'),
    };
  }

  setSlotsLimited(slotsLimited) {
    let returnRecord = this;

    returnRecord = returnRecord.set('slotsLimited', !!slotsLimited);

    if (!returnRecord.get('slotsLimited')) {
      returnRecord = returnRecord.set('totalSlots', null);
      returnRecord = returnRecord.set('minimumSlots', null);
      returnRecord = returnRecord.set('preferredSlots', null);
    }

    return returnRecord;
  }

  setSlotField(field, value) {
    switch (field) {
      case 'minimumSlots': return this.setMinimumSlots(value);
      case 'preferredSlots': return this.setPreferredSlots(value);
      case 'totalSlots': return this.setTotalSlots(value);
      default: throw new Error(`Unknown field: ${field}`);
    }
  }

  checkFieldMinimum(targetField, minimumSettingField) {
    const minimumValue = this.get(minimumSettingField);

    if (this.get(targetField) < minimumValue) {
      return this.setSlotField(targetField, minimumValue);
    }

    return this;
  }

  setMinimumSlots(newCount) {
    return this.set('minimumSlots', newCount).checkFieldMinimum('preferredSlots', 'minimumSlots');
  }

  setPreferredSlots(newCount) {
    return this.set('preferredSlots', newCount).checkFieldMinimum('totalSlots', 'preferredSlots');
  }

  setTotalSlots(newCount) {
    return this.set('totalSlots', newCount);
  }
}
