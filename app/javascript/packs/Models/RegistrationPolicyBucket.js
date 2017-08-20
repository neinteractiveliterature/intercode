// @flow

import { Record } from 'immutable';

export type RegistrationPolicyBucketAPIRepresentation = {
  key?: string,
  name?: string,
  description?: string,
  total_slots?: number,
  minimum_slots?: number,
  preferred_slots?: number,
  slots_limited?: boolean,
  anything?: boolean
};

const defaultProperties: {
  key: string | null,
  name: string | null,
  description: string | null,
  totalSlots: number | null,
  minimumSlots: number | null,
  preferredSlots: number | null,
  slotsLimited: boolean,
  anything: boolean,
} = {
  key: null,
  name: null,
  description: null,
  totalSlots: null,
  minimumSlots: null,
  preferredSlots: null,
  slotsLimited: false,
  anything: false,
};

export default class RegistrationPolicyBucket extends Record(defaultProperties) {
  static fromAPI(json: RegistrationPolicyBucketAPIRepresentation): RegistrationPolicyBucket {
    return new RegistrationPolicyBucket().setAttributesFromAPI(json);
  }

  setAttributesFromAPI(json: RegistrationPolicyBucketAPIRepresentation): RegistrationPolicyBucket {
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

  getAPIRepresentation(): RegistrationPolicyBucketAPIRepresentation {
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

  setSlotsLimited(slotsLimited: boolean): RegistrationPolicyBucket {
    let returnRecord = this;

    returnRecord = returnRecord.set('slotsLimited', !!slotsLimited);

    if (!returnRecord.get('slotsLimited')) {
      returnRecord = returnRecord.set('totalSlots', null);
      returnRecord = returnRecord.set('minimumSlots', null);
      returnRecord = returnRecord.set('preferredSlots', null);
    }

    return returnRecord;
  }

  setMinimumSlots(newCount: number): RegistrationPolicyBucket {
    let returnRecord = this;

    returnRecord = returnRecord.set('minimumSlots', newCount);
    if (returnRecord.get('preferredSlots') < newCount) {
      returnRecord = returnRecord.setPreferredSlots(newCount);
    }

    return returnRecord;
  }

  setPreferredSlots(newCount: number): RegistrationPolicyBucket {
    let returnRecord = this;

    returnRecord = returnRecord.set('preferredSlots', newCount);
    if (returnRecord.get('totalSlots') < newCount) {
      returnRecord = returnRecord.setTotalSlots(newCount);
    }

    return returnRecord;
  }

  setTotalSlots(newCount: number): RegistrationPolicyBucket {
    return this.set('totalSlots', newCount);
  }
}
