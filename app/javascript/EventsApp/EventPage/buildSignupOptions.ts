import { notEmpty } from '@neinteractiveliterature/litform';

import { EventPageQueryData, RunCardRegistrationPolicyFieldsFragment } from './queries.generated';
import sortBuckets from './sortBuckets';
import SignupCountData from '../SignupCountData';
import { SignupState, SignupRankedChoice, UserSignupConstraints } from '../../graphqlTypes.generated';

type SignupOptionBucket = RunCardRegistrationPolicyFieldsFragment['buckets'][0];

type SignupOptionAction = 'SIGN_UP_NOW' | 'WAITLIST' | 'ADD_TO_QUEUE' | 'IN_QUEUE';

export type SignupOption = {
  bucket?: SignupOptionBucket;
  key: string;
  label?: string;
  buttonClass: string;
  helpText?: string;
  noPreference: boolean;
  counted: boolean;
  teamMember: boolean;
  action: SignupOptionAction;
  pendingRankedChoices: Pick<SignupRankedChoice, 'priority' | 'requested_bucket_key'>[];
};

function isMainOption(option: SignupOption, noPreferenceOptions: SignupOption[], notCountedOptions: SignupOption[]) {
  if (option.bucket && option.bucket.anything) {
    return false;
  }

  if (noPreferenceOptions.length === 0 && notCountedOptions.length === 0) {
    return true;
  }

  return option.noPreference || ((option.bucket || {}).slots_limited && option.counted);
}

function isTeamMember(
  event: { team_members: { user_con_profile: { id: string } }[] },
  userConProfile?: { id: string },
) {
  if (!userConProfile) {
    return false;
  }

  return event.team_members.some((teamMember) => teamMember.user_con_profile.id === userConProfile.id);
}

function buildBucketSignupOption(
  bucket: SignupOptionBucket,
  index: number,
  hideLabel: boolean,
  action: SignupOptionAction,
  pendingRankedChoices: SignupOption['pendingRankedChoices'],
): SignupOption {
  return {
    key: bucket.key,
    label: hideLabel ? undefined : (bucket.name ?? undefined),
    buttonClass: `btn-outline-bucket-color-${(index % 9) + 1}`,
    bucket,
    helpText: bucket.description ?? undefined,
    noPreference: false,
    teamMember: false,
    counted: !bucket.not_counted,
    action,
    pendingRankedChoices,
  };
}

function buildNoPreferenceOptions(
  event: Pick<EventPageQueryData['convention']['event'], 'registration_policy'>,
  signupCounts: SignupCountData,
  addToQueue: boolean,
  inQueue: boolean,
  pendingRankedChoices: SignupOption['pendingRankedChoices'],
): SignupOption[] {
  if ((event.registration_policy || {}).prevent_no_preference_signups) {
    return [];
  }

  const eligibleBuckets = ((event.registration_policy || {}).buckets || []).filter(
    (bucket) => bucket.slots_limited && !bucket.not_counted,
  );

  if (eligibleBuckets.length < 2) {
    return [];
  }

  const totalSlots = (event.registration_policy?.buckets ?? []).reduce((sum, bucket) => {
    if (bucket.slots_limited && !bucket.not_counted) {
      return sum + (bucket.total_slots ?? 0);
    } else {
      return sum;
    }
  }, 0);

  let action: SignupOptionAction = 'SIGN_UP_NOW';
  if (inQueue) {
    action = 'IN_QUEUE';
  } else if (addToQueue) {
    action = 'ADD_TO_QUEUE';
  } else if (signupCounts.getConfirmedLimitedSignupCount(event) >= totalSlots) {
    action = 'WAITLIST';
  }

  return [
    {
      key: '_no_preference',
      label: 'No preference',
      buttonClass: 'btn-outline-dark',
      bucket: undefined,
      helpText: `Sign up for any of: ${eligibleBuckets.map((bucket) => bucket.name).join(', ')}`,
      noPreference: true,
      teamMember: false,
      counted: true, // no preference signups only go to counted buckets,
      action,
      pendingRankedChoices,
    },
  ];
}

function allSignupOptions(
  event: Parameters<typeof buildNoPreferenceOptions>[0] &
    Parameters<typeof isTeamMember>[0] & {
      event_category: {
        team_member_name: string;
      };
    },
  signupCounts: SignupCountData,
  addToQueue: boolean,
  myPendingRankedChoices: Pick<SignupRankedChoice, 'requested_bucket_key' | 'priority'>[],
  userSignupConstraints: Pick<UserSignupConstraints, 'at_maximum_signups'>,
  userConProfile?: { id: string },
): SignupOption[] {
  if (isTeamMember(event, userConProfile)) {
    return [
      {
        key: '_team_member',
        label: event.event_category.team_member_name,
        buttonClass: 'btn-outline-primary',
        bucket: undefined,
        helpText: `Register your intent to come to this event as a ${event.event_category.team_member_name}`,
        noPreference: false,
        teamMember: true,
        counted: false,
        action: 'SIGN_UP_NOW',
        pendingRankedChoices: [],
      },
    ];
  }

  const buckets = sortBuckets((event.registration_policy || {}).buckets || []);
  const nonAnythingBuckets = buckets.filter((bucket) => !bucket.anything);
  const hasAvailableSignups = !userSignupConstraints.at_maximum_signups;
  const noPreferencePendingRankedChoices = myPendingRankedChoices.filter(
    (request) => request.requested_bucket_key == null,
  );
  const limitedAnythingBuckets = buckets.filter((bucket) => bucket.anything && bucket.slots_limited);
  const limitedAnythingBucketsCapacity = limitedAnythingBuckets.reduce(
    (total, bucket) => total + (bucket.total_slots ?? 0),
    0,
  );
  const limitedAnythingBucketsSignupCount = signupCounts.sumSignupCounts({
    bucket_key: limitedAnythingBuckets.map((bucket) => bucket.key),
    state: SignupState.Confirmed,
  });

  return [
    ...buckets
      .map((bucket, index) => {
        // yes, this seems inefficient, but we need to count the anything buckets
        // so the indexes match the run capacity graph's indexes
        if (bucket.anything) {
          return null;
        }

        let action: SignupOptionAction = 'SIGN_UP_NOW';
        const pendingRankedChoices = myPendingRankedChoices.filter(
          (request) => request.requested_bucket_key === bucket.key,
        );
        if (!hasAvailableSignups && pendingRankedChoices.length > 0) {
          action = 'IN_QUEUE';
        } else if (!hasAvailableSignups && addToQueue && !bucket.not_counted) {
          action = 'ADD_TO_QUEUE';
        } else if (
          bucket.slots_limited &&
          signupCounts.sumSignupCounts({ bucket_key: bucket.key, state: SignupState.Confirmed }) +
            limitedAnythingBucketsSignupCount >=
            (bucket.total_slots ?? 0) + limitedAnythingBucketsCapacity
        ) {
          action = 'WAITLIST';
        }

        return buildBucketSignupOption(
          bucket,
          index,
          !bucket.not_counted && nonAnythingBuckets.length === 1,
          action,
          pendingRankedChoices,
        );
      })
      .filter(notEmpty),
    ...buildNoPreferenceOptions(
      event,
      signupCounts,
      addToQueue,
      noPreferencePendingRankedChoices.length > 0,
      noPreferencePendingRankedChoices,
    ),
  ];
}

export type PartitionedSignupOptions = {
  mainPreference: SignupOption[];
  mainNoPreference: SignupOption[];
  auxiliary: SignupOption[];
};

export default function buildSignupOptions(
  event: Parameters<typeof allSignupOptions>[0],
  signupCounts: SignupCountData,
  addToQueue: boolean,
  myPendingRankedChoices: Pick<SignupRankedChoice, 'requested_bucket_key' | 'priority'>[],
  userSignupConstraints: Pick<UserSignupConstraints, 'at_maximum_signups'>,
  userConProfile?: { id: string },
): PartitionedSignupOptions {
  const allOptions = allSignupOptions(
    event,
    signupCounts,
    addToQueue,
    myPendingRankedChoices,
    userSignupConstraints,
    userConProfile,
  );
  const noPreferenceOptions = allOptions.filter((option) => option.noPreference);
  const notCountedOptions = allOptions.filter((option) => !option.counted);

  const partitionedOptions: PartitionedSignupOptions = {
    mainPreference: [],
    mainNoPreference: [],
    auxiliary: [],
  };

  allOptions.forEach((option) => {
    if (isMainOption(option, noPreferenceOptions, notCountedOptions)) {
      if (option.noPreference) {
        partitionedOptions.mainNoPreference.push(option);
      } else {
        partitionedOptions.mainPreference.push(option);
      }
    } else {
      partitionedOptions.auxiliary.push(option);
    }
  });

  return partitionedOptions;
}
