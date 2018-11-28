import getCapacityThresholds from './getCapacityThresholds';

export default function getFullnessClass(event, signupCountData) {
  if (!event.registration_policy.slots_limited) {
    return 'event-fullness-unlimited';
  }

  if (event.registration_policy.total_slots_including_not_counted === 0) {
    return 'event-fullness-no-slots';
  }

  const thresholds = getCapacityThresholds(event.registration_policy);
  const signupCount = (
    event.registration_policy.only_uncounted
      ? signupCountData.getNotCountedConfirmedSignupCount()
      : signupCountData.getConfirmedLimitedSignupCount(event)
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
