function getFullnessThresholds(event) {
  const { registration_policy: registrationPolicy } = event;

  if (registrationPolicy.only_uncounted) {
    return {
      total_slots: registrationPolicy.total_slots_including_not_counted,
      preferred_slots: registrationPolicy.preferred_slots_including_not_counted,
      minimum_slots: registrationPolicy.minimum_slots_including_not_counted,
    };
  }

  return {
    total_slots: registrationPolicy.total_slots,
    preferred_slots: registrationPolicy.preferred_slots,
    minimum_slots: registrationPolicy.minimum_slots,
  };
}

export default function getFullnessClass(event, run) {
  if (!event.registration_policy.slots_limited) {
    return 'event-fullness-unlimited';
  }

  if (event.registration_policy.total_slots_including_not_counted === 0) {
    return 'event-fullness-no-slots';
  }

  const thresholds = getFullnessThresholds(event);
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
