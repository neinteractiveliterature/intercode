import { getRegistrationPolicyBucket } from './RegistrationPolicy';

export function presetMatchesPolicy(registrationPolicy, preset) {
  if (
    Boolean(registrationPolicy.prevent_no_preference_signups)
    !== Boolean(preset.policy.prevent_no_preference_signups)
  ) {
    return false;
  }

  const allKeysMatch = preset.policy.buckets.every(bucket => (
    typeof bucket.key === 'string' && getRegistrationPolicyBucket(registrationPolicy, bucket.key)
  ));
  if (!allKeysMatch) {
    return false;
  }

  const allBucketOptionsMatch = registrationPolicy.buckets
    .every(bucket => preset.policy.buckets.find(presetBucket => presetBucket.key === bucket.key
      && !!presetBucket.slots_limited === !!bucket.slots_limited
      && !!presetBucket.not_counted === !!bucket.not_counted
      && !!presetBucket.expose_attendees === !!bucket.expose_attendees));
  if (!allBucketOptionsMatch) {
    return false;
  }

  return true;
}

export function findPreset(registrationPolicy, presets) {
  if (!Array.isArray(presets)) {
    return null;
  }

  if (!registrationPolicy) {
    return null;
  }

  return presets.find(preset => presetMatchesPolicy(registrationPolicy, preset));
}


export function bucketSortCompare(a, b) {
  if (a.anything && !b.anything) {
    return 1;
  }

  if (b.anything && !a.anything) {
    return -1;
  }

  return a.name.localeCompare(b.name, { sensitivity: 'base' });
}

export function isPreventNoPreferenceSignupsApplicable(registrationPolicy) {
  return registrationPolicy.buckets
    .filter(bucket => bucket.slots_limited)
    .length > 1;
}
