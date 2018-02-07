import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RegistrationPolicyBucket from './RegistrationPolicyBucket';

export default class RegistrationPolicy {
  static propType = PropTypes.shape({
    buckets: ImmutablePropTypes.listOf(RegistrationPolicyBucket.propType.isRequired).isRequired,
    preventNoPreferenceSignups: PropTypes.bool.isRequired,
  });
  static apiRepresentationPropType = PropTypes.shape({
    buckets:
      PropTypes.arrayOf(RegistrationPolicyBucket.apiRepresentationPropType.isRequired).isRequired,
    prevent_no_preference_signups: PropTypes.bool,
  });

  static fromAPI(json) {
    return new RegistrationPolicy().setAttributesFromAPI(json);
  }

  constructor(buckets = null, preventNoPreferenceSignups = false) {
    this.buckets = buckets || new List();
    this.preventNoPreferenceSignups = preventNoPreferenceSignups;
  }

  getAPIRepresentation() {
    return {
      prevent_no_preference_signups: this.preventNoPreferenceSignups,
      buckets: this.buckets.map(bucket => bucket.getAPIRepresentation()).toJS(),
    };
  }

  setAttributesFromAPI(json) {
    let returnRecord = this;

    if (json.buckets !== undefined) {
      const buckets = json.buckets.map(bucket => RegistrationPolicyBucket.fromAPI(bucket));
      returnRecord = returnRecord.setBuckets(buckets);
    }

    this.preventNoPreferenceSignups = Boolean(json.prevent_no_preference_signups);

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
    return new RegistrationPolicy(
      this.buckets.push(bucket.setAttributesFromAPI(props || {})),
      this.preventNoPreferenceSignups,
    );
  }

  getBucket(key) {
    return this.buckets.find(bucket => bucket.get('key') === key);
  }

  deleteBucket(key) {
    return new RegistrationPolicy(
      this.buckets.filter(bucket => bucket.get('key') !== key),
      this.preventNoPreferenceSignups,
    );
  }

  updateBucket(key, newBucket) {
    const index = this.buckets.findIndex(bucket => bucket.get('key') === key);

    if (index === -1) {
      return new RegistrationPolicy(
        this.buckets.push(newBucket),
        this.preventNoPreferenceSignups,
      );
    }

    return new RegistrationPolicy(
      this.buckets.set(index, newBucket),
      this.preventNoPreferenceSignups,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  setBuckets(buckets) {
    if (Array.isArray(buckets)) {
      return new RegistrationPolicy(
        new List(buckets),
        this.preventNoPreferenceSignups,
      );
    }

    return new RegistrationPolicy(buckets, this.preventNoPreferenceSignups);
  }

  getAnythingBucket() {
    return this.buckets.find(bucket => bucket.get('anything'));
  }

  getPreventNoPreferenceSignups() {
    return this.preventNoPreferenceSignups;
  }

  setPreventNoPreferenceSignups(preventNoPreferenceSignups) {
    return new RegistrationPolicy(this.buckets, preventNoPreferenceSignups);
  }
}
