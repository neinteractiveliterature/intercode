export type RegistrationPolicyForCapacityThresholds = {
  only_uncounted?: boolean | null;
  total_slots?: number | null;
  preferred_slots?: number | null;
  minimum_slots?: number | null;
  total_slots_including_not_counted?: number | null;
  preferred_slots_including_not_counted?: number | null;
  minimum_slots_including_not_counted?: number | null;
};

export default function getCapacityThresholds(
  registrationPolicy: RegistrationPolicyForCapacityThresholds,
): Record<'total_slots' | 'preferred_slots' | 'minimum_slots', number | null | undefined> {
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
