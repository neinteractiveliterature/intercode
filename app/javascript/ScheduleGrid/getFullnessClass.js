import getCapacityThresholds from './getCapacityThresholds';

export default function getFullnessClass(event, run) {
  if (!event.registration_policy.slots_limited) {
    return 'event-fullness-unlimited';
  }

  if (event.registration_policy.total_slots_including_not_counted === 0) {
    return 'event-fullness-no-slots';
  }

  const thresholds = getCapacityThresholds(event.registration_policy);
  const signupCount = (
    event.registration_policy.only_uncounted
      ? run.not_counted_confirmed_signup_count
      : run.confirmed_limited_signup_count
  );

  if (signupCount >= thresholds.total_slots) {
    return 'event-fullness-full';
  }

  if (signupCount >= thresholds.preferred_slots) {
    return 'event-fullness-preferred';
  }

  if (signupCount >= thresholds.minimum_slots) {
    return 'event-fullness-minimum';
  }

  return 'event-fullness-below-minimum';
}
