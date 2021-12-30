import { assertNever } from 'assert-never';
import { TFunction } from 'i18next';
import snakeCase from 'lodash/snakeCase';

import { RegistrationPolicyBucket, Signup, SignupState } from '../../graphqlTypes.generated';
import humanize from '../../humanize';

export function findBucket<BucketType extends Pick<RegistrationPolicyBucket, 'key'>>(
  bucketKey: string | null | undefined,
  registrationPolicy: { buckets: BucketType[] },
): BucketType | undefined {
  return registrationPolicy.buckets.find((bucket) => bucket.key === bucketKey);
}

export type SignupForFormatBucket = Pick<Signup, 'bucket_key' | 'counted' | 'state' | 'requested_bucket_key'> & {
  user_con_profile?: { id: string };
};

export type EventForFormatBucket = {
  event_category: {
    team_member_name: string;
  };
  registration_policy?: null | {
    buckets: {
      key: string;
      name?: string | null;
    }[];
  };
  team_members: { user_con_profile?: { id: string } }[];
};

export function formatBucket(signup: SignupForFormatBucket, event: EventForFormatBucket, t: TFunction): string {
  const { bucket_key: bucketKey } = signup;
  const registrationPolicy = event.registration_policy ?? { buckets: [] };

  if (!signup.counted) {
    if (bucketKey) {
      return t('signups.states.notCountedWithBucket', '{{ bucketName }} (not counted)', {
        bucketName: findBucket(bucketKey, registrationPolicy)?.name,
      });
    }

    if (event.team_members.some((teamMember) => teamMember.user_con_profile?.id === signup.user_con_profile?.id)) {
      return t('signups.states.teamMemberNotCounted', '{{ teamMemberName }} (not counted)', {
        teamMemberName: humanize(snakeCase(event.event_category.team_member_name)),
      });
    }

    if (signup.state === 'waitlisted') {
      const requestedBucket = findBucket(signup.requested_bucket_key, registrationPolicy);
      if (requestedBucket) {
        return t('signups.states.waitlistedWithRequestedBucket', 'Waitlisted (requested {{ requestedBucketName }})', {
          requestedBucketName: requestedBucket.name,
        });
      }

      return t('signups.states.waitlistedNoPreference', 'Waitlisted (no preference)');
    }

    return t('signups.states.notCounted', 'Not counted');
  }

  const bucket = findBucket(bucketKey, registrationPolicy);
  const requestedBucket = findBucket(signup.requested_bucket_key, registrationPolicy);

  if (bucket && requestedBucket && bucket.name != null && bucket.name === requestedBucket.name) {
    return bucket.name;
  }

  if (requestedBucket) {
    return t('signups.states.inUnrequestedBucket', '{{ bucketName }} (requested {{ requestedBucketName }})', {
      bucketName: bucket?.name ?? t('signups.states.noBucketName', 'None'),
      requestedBucketName: requestedBucket.name,
    });
  }

  if (bucket) {
    return t('signups.states.bucketWithNoPreference', '{{ bucketName }} (no preference)', {
      bucketName: bucket.name,
    });
  }

  return t('signups.states.noBucketName', 'None');
}

export function formatSignupState(state: SignupState | undefined | null, t: TFunction): string {
  if (state == null) {
    return t('signups.states.notSignedUp', 'Not signed up');
  }

  switch (state) {
    case SignupState.Confirmed:
      return t('signups.states.confirmed', 'Confirmed');
    case SignupState.Waitlisted:
      return t('signups.states.waitlisted', 'Waitlisted');
    case SignupState.Withdrawn:
      return t('signups.states.withdrawn', 'Withdrawn');
    default:
      assertNever(state, true);
      // @ts-expect-error Deliberately unreachable code in case we get an invalid state
      return state;
  }
}

export function formatSignupStatus(signup: SignupForFormatBucket, event: EventForFormatBucket, t: TFunction): string {
  if (signup.state === 'confirmed') {
    return formatBucket(signup, event, t);
  }

  const requestedBucket = findBucket(signup.requested_bucket_key, event.registration_policy ?? { buckets: [] });
  const stateText = formatSignupState(signup.state, t);

  if (requestedBucket) {
    return t('signups.states.stateWithRequestedBucket', '{{ state }} (requested {{ requestedBucket }})', {
      state: stateText,
      requestedBucket: requestedBucket.name,
    });
  }

  return stateText;
}
