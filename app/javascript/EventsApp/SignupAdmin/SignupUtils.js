import { humanize, underscore } from 'inflected';

export function findBucket(bucketKey, registrationPolicy) {
  return registrationPolicy.buckets.find((bucket) => bucket.key === bucketKey);
}

export function formatBucket(signup, event, t) {
  const { bucket_key: bucketKey } = signup;

  if (!signup.counted) {
    if (bucketKey) {
      return t(
        'signups.states.notCountedWithBucket',
        '{{ bucketName }} (not counted)',
        { bucketName: findBucket(bucketKey, event.registration_policy).name },
      );
    }

    if (event.team_members
      .some((teamMember) => teamMember.user_con_profile?.id === signup.user_con_profile?.id)
    ) {
      return t(
        'signups.states.teamMemberNotCounted',
        '{{ teamMemberName }} (not counted)',
        { teamMemberName: humanize(underscore(event.event_category.team_member_name)) },
      );
    }

    if (signup.state === 'waitlisted') {
      const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy);
      if (requestedBucket) {
        return t(
          'signups.states.waitlistedWithRequestedBucket',
          'Waitlisted (requested {{ requestedBucketName }})',
          { requestedBucketName: requestedBucket.name },
        );
      }

      return t('signups.states.waitlistedNoPreference', 'Waitlisted (no preference)');
    }

    return t('signups.states.notCounted', 'Not counted');
  }

  const bucket = findBucket(bucketKey, event.registration_policy);
  const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy);

  if (bucket && requestedBucket && bucket.name === requestedBucket.name) {
    return bucket.name;
  }

  if (requestedBucket) {
    return t(
      'signups.states.inUnrequestedBucket',
      '{{ bucketName }} (requested {{ requestedBucketName }})',
      { bucketName: bucket?.name ?? t('signups.states.noBucketName', 'None') },
    );
  }

  if (bucket) {
    return t(
      'signups.states.bucketWithNoPreference',
      '{{ bucketName }} (no preference)',
      { bucketName: bucket.name },
    );
  }

  return t('signups.states.noBucketName', 'None');
}

export function formatSignupState(state, t) {
  if (state === 'confirmed') {
    return t('signups.states.confirmed', 'Confirmed');
  }

  if (state === 'waitlisted') {
    return t('signups.states.waitlisted', 'Waitlisted');
  }

  if (state === 'withdrawn') {
    return t('signups.states.withdrawn', 'Withdrawn');
  }

  if (state == null) {
    return t('signups.states.notSignedUp', 'Not signed up');
  }

  return state;
}

export function formatSignupStatus(signup, event, t) {
  if (signup.state === 'confirmed') {
    return formatBucket(signup, event, t);
  }

  const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy);
  const stateText = formatSignupState(signup.state, t);

  if (requestedBucket) {
    return t(
      'signups.states.stateWithRequestedBucket',
      '{{ state }} (requested {{ requestedBucket }})',
      { state: stateText, requestedBucket: requestedBucket.name },
    );
  }

  return stateText;
}
