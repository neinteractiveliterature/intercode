import PropTypes from 'prop-types';
import { RegistrationPolicyBucketPropType } from './RegistrationPolicyBucket';

function sumBucketProperty(registrationPolicy, property) {
  return (registrationPolicy.buckets || [])
    .reduce((sum, bucket) => (sum + bucket[property] || 0), 0);
}

export function sumTotalSlots(registrationPolicy) {
  return sumBucketProperty(registrationPolicy, 'total_slots');
}

export function sumMinimumSlots(registrationPolicy) {
  return sumBucketProperty(registrationPolicy, 'minimum_slots');
}

export function sumPreferredSlots(registrationPolicy) {
  return sumBucketProperty(registrationPolicy, 'preferred_slots');
}

export function getRegistrationPolicySlotsLimited(registrationPolicy) {
  return (registrationPolicy.buckets || []).every((bucket) => bucket.slots_limited);
}

export function getRegistrationPolicyBucket(registrationPolicy, key) {
  return (registrationPolicy.buckets || []).find((bucket) => bucket.key === key);
}

export function addRegistrationPolicyBucket(registrationPolicy, key, bucket) {
  if (getRegistrationPolicyBucket(registrationPolicy, key)) {
    throw new Error(`Bucket with key ${key} already exists in registration policy`);
  }

  return {
    ...registrationPolicy,
    buckets: [...(registrationPolicy.buckets || []), { key, ...bucket }],
  };
}

export function removeRegistrationPolicyBucket(registrationPolicy, key) {
  return {
    ...registrationPolicy,
    buckets: (registrationPolicy.buckets || []).filter((bucket) => bucket.key !== key),
  };
}

export function updateRegistrationPolicyBucket(registrationPolicy, key, newBucket) {
  const index = (registrationPolicy.buckets || []).findIndex((bucket) => bucket.key === key);

  if (index === -1) {
    return addRegistrationPolicyBucket(registrationPolicy, newBucket);
  }

  const newBuckets = [...(registrationPolicy.buckets || [])];
  newBuckets.splice(index, 1, newBucket);

  return {
    ...registrationPolicy,
    buckets: newBuckets,
  };
}

export function getRegistrationPolicyAnythingBucket(registrationPolicy) {
  return (registrationPolicy.buckets || []).find((bucket) => bucket.anything);
}

export const RegistrationPolicyPropType = PropTypes.shape({
  buckets: PropTypes.arrayOf(RegistrationPolicyBucketPropType.isRequired).isRequired,
  prevent_no_preference_signups: PropTypes.bool,
});
