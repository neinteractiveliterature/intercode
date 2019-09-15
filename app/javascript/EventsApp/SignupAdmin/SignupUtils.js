import { humanize, underscore } from 'inflected';

export function findBucket(bucketKey, registrationPolicy) {
  return registrationPolicy.buckets.find((bucket) => bucket.key === bucketKey);
}

export function formatBucket(signup, event) {
  const { bucket_key: bucketKey } = signup;

  if (!signup.counted) {
    if (bucketKey) {
      return `${findBucket(bucketKey, event.registration_policy).name} (not counted)`;
    }

    if (event.team_members
      .some((teamMember) => teamMember.user_con_profile.id === signup.user_con_profile.id)
    ) {
      return `${humanize(underscore(event.event_category.team_member_name))} (not counted)`;
    }

    if (signup.state === 'waitlisted') {
      const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy);
      if (requestedBucket) {
        return `Waitlisted (requested ${requestedBucket.name})`;
      }

      return 'Waitlisted (no preference)';
    }

    return 'Not counted';
  }

  const bucket = findBucket(bucketKey, event.registration_policy);
  const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy);

  if (bucket && requestedBucket && bucket.name === requestedBucket.name) {
    return bucket.name;
  }

  if (requestedBucket) {
    return `${(bucket || {}).name || 'None'} (requested ${requestedBucket.name})`;
  }

  if (bucket) {
    return `${bucket.name} (no preference)`;
  }

  return 'None';
}

export function formatSignupStatus(signup, event) {
  if (signup.state === 'confirmed') {
    return formatBucket(signup, event);
  }

  const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy);

  if (requestedBucket) {
    return `${humanize(signup.state)} (requested ${requestedBucket.name})`;
  }

  return humanize(signup.state);
}
