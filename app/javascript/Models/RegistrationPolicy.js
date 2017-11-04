// @flow

import { List } from 'immutable';
import RegistrationPolicyBucket from './RegistrationPolicyBucket';
import type { RegistrationPolicyBucketAPIRepresentation } from './RegistrationPolicyBucket';

export type RegistrationPolicyAPIRepresentation = {
  buckets: Array<RegistrationPolicyBucketAPIRepresentation>,
};

export default class RegistrationPolicy {
  buckets: List<RegistrationPolicyBucket>

  static fromAPI(json: RegistrationPolicyAPIRepresentation): RegistrationPolicy {
    return new RegistrationPolicy().setAttributesFromAPI(json);
  }

  constructor(buckets: List<RegistrationPolicyBucket> | null = null) {
    this.buckets = buckets || new List();
  }

  getAPIRepresentation(): RegistrationPolicyAPIRepresentation {
    return {
      buckets: this.buckets.map(bucket => bucket.getAPIRepresentation()).toJS(),
    };
  }

  setAttributesFromAPI(json: RegistrationPolicyAPIRepresentation): RegistrationPolicy {
    let returnRecord = this;

    if (json.buckets !== undefined) {
      returnRecord = returnRecord.setBuckets(json.buckets.map(bucket => RegistrationPolicyBucket.fromAPI(bucket)));
    }

    return returnRecord;
  }

  sumBucketProperty = (getter: (RegistrationPolicyBucket) => number | null): number => (
    this.buckets.reduce((sum, bucket) => sum + (getter(bucket) || 0), 0)
  )

  getTotalSlots = () => this.sumBucketProperty(bucket => bucket.totalSlots)
  getMinimumSlots = () => this.sumBucketProperty(bucket => bucket.minimumSlots)
  getPreferredSlots = () => this.sumBucketProperty(bucket => bucket.preferredSlots)
  slotsLimited = () => this.buckets.every(bucket => bucket.slotsLimited)

  addBucket(
    key: string,
    props: RegistrationPolicyBucketAPIRepresentation = {},
  ): RegistrationPolicy {
    const bucket = new RegistrationPolicyBucket({ key });
    return new RegistrationPolicy(this.buckets.push(bucket.setAttributesFromAPI(props)));
  }

  getBucket(key: string): ?RegistrationPolicyBucket {
    return this.buckets.find(bucket => bucket.get('key') === key);
  }

  deleteBucket(key: string): RegistrationPolicy {
    return new RegistrationPolicy(this.buckets.filter(bucket => bucket.get('key') !== key));
  }

  updateBucket(key: string, newBucket: RegistrationPolicyBucket): RegistrationPolicy {
    const index = this.buckets.findIndex(bucket => bucket.get('key') === key);

    if (index === -1) {
      return new RegistrationPolicy(this.buckets.push(newBucket));
    }

    return new RegistrationPolicy(this.buckets.set(index, newBucket));
  }

  // eslint-disable-next-line class-methods-use-this
  setBuckets(buckets: List<RegistrationPolicyBucket> | Array<RegistrationPolicyBucket> | null) {
    if (Array.isArray(buckets)) {
      return new RegistrationPolicy(new List(buckets));
    }

    return new RegistrationPolicy(buckets);
  }

  getAnythingBucket(): ?RegistrationPolicyBucket {
    return this.buckets.find(bucket => bucket.get('anything'));
  }
}
