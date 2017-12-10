import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RegistrationPolicyBucket from './RegistrationPolicyBucket';

export default class RegistrationPolicy {
  static propType = PropTypes.shape({
    buckets: ImmutablePropTypes.listOf(RegistrationPolicyBucket.propType.isRequired).isRequired,
  });
  static apiRepresentationPropType = PropTypes.shape({
    buckets:
      PropTypes.arrayOf(RegistrationPolicyBucket.apiRepresentationPropType.isRequired).isRequired,
  });

  static fromAPI(json) {
    return new RegistrationPolicy().setAttributesFromAPI(json);
  }

  constructor(buckets = null) {
    this.buckets = buckets || new List();
  }

  getAPIRepresentation() {
    return {
      buckets: this.buckets.map(bucket => bucket.getAPIRepresentation()).toJS(),
    };
  }

  setAttributesFromAPI(json) {
    let returnRecord = this;

    if (json.buckets !== undefined) {
      const buckets = json.buckets.map(bucket => RegistrationPolicyBucket.fromAPI(bucket));
      returnRecord = returnRecord.setBuckets(buckets);
    }

    return returnRecord;
  }

  sumBucketProperty = getter => (
    this.buckets.reduce((sum, bucket) => sum + (getter(bucket) || 0), 0)
  )

  getTotalSlots = () => this.sumBucketProperty(bucket => bucket.totalSlots)
  getMinimumSlots = () => this.sumBucketProperty(bucket => bucket.minimumSlots)
  getPreferredSlots = () => this.sumBucketProperty(bucket => bucket.preferredSlots)
  slotsLimited = () => this.buckets.every(bucket => bucket.slotsLimited)

  addBucket(key, props) {
    const bucket = new RegistrationPolicyBucket({ key });
    return new RegistrationPolicy(this.buckets.push(bucket.setAttributesFromAPI(props)));
  }

  getBucket(key) {
    return this.buckets.find(bucket => bucket.get('key') === key);
  }

  deleteBucket(key) {
    return new RegistrationPolicy(this.buckets.filter(bucket => bucket.get('key') !== key));
  }

  updateBucket(key, newBucket) {
    const index = this.buckets.findIndex(bucket => bucket.get('key') === key);

    if (index === -1) {
      return new RegistrationPolicy(this.buckets.push(newBucket));
    }

    return new RegistrationPolicy(this.buckets.set(index, newBucket));
  }

  // eslint-disable-next-line class-methods-use-this
  setBuckets(buckets) {
    if (Array.isArray(buckets)) {
      return new RegistrationPolicy(new List(buckets));
    }

    return new RegistrationPolicy(buckets);
  }

  getAnythingBucket() {
    return this.buckets.find(bucket => bucket.get('anything'));
  }
}
