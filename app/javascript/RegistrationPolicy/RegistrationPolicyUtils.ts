import { RegistrationPolicyPreset } from '../FormAdmin/FormItemUtils';
import { BucketForRegistrationPolicyUtils, RegistrationPolicyForRegistrationPolicyUtils } from './RegistrationPolicy';

export function presetMatchesPolicy(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
  preset: RegistrationPolicyPreset,
): boolean {
  if (
    Boolean(registrationPolicy.prevent_no_preference_signups) !== Boolean(preset.policy.prevent_no_preference_signups)
  ) {
    return false;
  }

  // Presets are admin-authored fixture data with no id/generatedId concept, so this match (and
  // bucketInPreset in RegistrationPolicyEditor) stays key-based permanently.
  const allKeysMatch = preset.policy.buckets.every(
    (bucket) =>
      typeof bucket.key === 'string' &&
      (registrationPolicy.buckets ?? []).some((policyBucket) => policyBucket.key === bucket.key),
  );
  if (!allKeysMatch) {
    return false;
  }

  const allBucketOptionsMatch = (registrationPolicy.buckets || []).every((bucket) =>
    preset.policy.buckets.find(
      (presetBucket) =>
        presetBucket.key === bucket.key &&
        !!presetBucket.slots_limited === !!bucket.slots_limited &&
        !!presetBucket.not_counted === !!bucket.not_counted &&
        !!presetBucket.expose_attendees === !!bucket.expose_attendees,
    ),
  );
  if (!allBucketOptionsMatch) {
    return false;
  }

  return true;
}

export function findPreset(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
  presets: RegistrationPolicyPreset[],
): RegistrationPolicyPreset | undefined {
  if (!Array.isArray(presets)) {
    return undefined;
  }

  if (!registrationPolicy) {
    return undefined;
  }

  return presets.find((preset) => presetMatchesPolicy(registrationPolicy, preset));
}

// Only breaks ties on "anything" (flex buckets sort last); buckets are otherwise left in their
// existing (persisted position/insertion) order via Array.prototype.sort's stability guarantee.
// Sorting by name here previously caused a bucket's row to jump position on every keystroke
// while an admin was typing its name -- since callers pass a live, in-progress bucket list,
// that made data entry look like it was leaking between buckets (it wasn't; only the display
// order was reshuffling out from under the user).
export function bucketSortCompare(a: BucketForRegistrationPolicyUtils, b: BucketForRegistrationPolicyUtils): number {
  if (a.anything && !b.anything) {
    return 1;
  }

  if (b.anything && !a.anything) {
    return -1;
  }

  return 0;
}

export function isPreventNoPreferenceSignupsApplicable(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
): boolean {
  return (registrationPolicy.buckets || []).filter((bucket) => bucket.slots_limited).length > 1;
}
