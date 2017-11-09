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
};

const fieldPropTypes = {
  key: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  totalSlots: PropTypes.number,
  minimumSlots: PropTypes.number,
  preferredSlots: PropTypes.number,
  slotsLimited: PropTypes.number,
  anything: PropTypes.bool,
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

  setMinimumSlots(newCount) {
    let returnRecord = this;

    returnRecord = returnRecord.set('minimumSlots', newCount);
    if (returnRecord.get('preferredSlots') < newCount) {
      returnRecord = returnRecord.setPreferredSlots(newCount);
    }

    return returnRecord;
  }

  setPreferredSlots(newCount) {
    let returnRecord = this;

    returnRecord = returnRecord.set('preferredSlots', newCount);
    if (returnRecord.get('totalSlots') < newCount) {
      returnRecord = returnRecord.setTotalSlots(newCount);
    }

    return returnRecord;
  }

  setTotalSlots(newCount) {
    return this.set('totalSlots', newCount);
  }
}
