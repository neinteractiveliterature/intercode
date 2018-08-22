export function presetMatchesPolicy(registrationPolicy, preset) {
  if (
    registrationPolicy.getPreventNoPreferenceSignups()
    !== Boolean(preset.policy.prevent_no_preference_signups)
  ) {
    return false;
  }

  const allKeysMatch = preset.policy.buckets.every(bucket => (
    typeof bucket.key === 'string' && registrationPolicy.getBucket(bucket.key)
  ));
  if (!allKeysMatch) {
    return false;
  }

  const allBucketOptionsMatch = registrationPolicy.buckets
    .every(bucket => preset.policy.buckets.find(presetBucket => presetBucket.key === bucket.key
      && !!presetBucket.slots_limited === !!bucket.slotsLimited
      && !!presetBucket.not_counted === !!bucket.notCounted
      && !!presetBucket.expose_attendees === !!bucket.exposeAttendees));
  if (!allBucketOptionsMatch) {
    return false;
  }

  return true;
}

export function findPreset(registrationPolicy, presets) {
  if (!Array.isArray(presets)) {
    return null;
  }

  return presets.find(preset => presetMatchesPolicy(registrationPolicy, preset));
}


export function bucketSortCompare(a, b) {
  if (a.get('anything') && !b.get('anything')) {
    return 1;
  }

  if (b.get('anything') && !a.get('anything')) {
    return -1;
  }

  return a.get('name').localeCompare(b.get('name'), { sensitivity: 'base' });
}

export function isPreventNoPreferenceSignupsApplicable(registrationPolicy) {
  return registrationPolicy.buckets
    .filter(bucket => bucket.get('slotsLimited'))
    .size > 1;
}
