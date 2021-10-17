import { notEmpty } from '@neinteractiveliterature/litform';

import { EventPageQueryData, RunCardRegistrationPolicyFieldsFragment } from './queries.generated';
import sortBuckets from './sortBuckets';

type SignupOptionBucket = RunCardRegistrationPolicyFieldsFragment['buckets'][0];

export type SignupOption = {
  bucket?: SignupOptionBucket;
  key: string;
  label?: string;
  buttonClass: string;
  helpText?: string;
  noPreference: boolean;
  counted: boolean;
  teamMember: boolean;
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

function buildBucketSignupOption(bucket: SignupOptionBucket, index: number, hideLabel: boolean): SignupOption {
  return {
    key: bucket.key,
    label: hideLabel ? undefined : bucket.name ?? undefined,
    buttonClass: `btn-outline-bucket-color-${(index % 9) + 1}`,
    bucket,
    helpText: bucket.description ?? undefined,
    noPreference: false,
    teamMember: false,
    counted: !bucket.not_counted,
  };
}

function buildNoPreferenceOptions(
  event: Pick<EventPageQueryData['convention']['event'], 'registration_policy'>,
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

  return [
    {
      key: '_no_preference',
      label: 'No preference',
      buttonClass: 'btn-outline-dark',
      bucket: undefined,
      helpText: `Sign up for any of: ${eligibleBuckets.map((bucket) => bucket.name).join(', ')}`,
      noPreference: true,
      teamMember: false,
      counted: true, // no preference signups only go to counted buckets
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
      },
    ];
  }

  const buckets = sortBuckets((event.registration_policy || {}).buckets || []);
  const nonAnythingBuckets = buckets.filter((bucket) => !bucket.anything);

  return [
    ...buckets
      .map((bucket, index) => {
        // yes, this seems inefficient, but we need to count the anything buckets
        // so the indexes match the run capacity graph's indexes
        if (bucket.anything) {
          return null;
        }

        return buildBucketSignupOption(bucket, index, !bucket.not_counted && nonAnythingBuckets.length === 1);
      })
      .filter(notEmpty),
    ...buildNoPreferenceOptions(event),
  ];
}

export type PartitionedSignupOptions = {
  mainPreference: SignupOption[];
  mainNoPreference: SignupOption[];
  auxiliary: SignupOption[];
};

export default function buildSignupOptions(
  event: Parameters<typeof allSignupOptions>[0],
  userConProfile?: { id: string },
): PartitionedSignupOptions {
  const allOptions = allSignupOptions(event, userConProfile);
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
