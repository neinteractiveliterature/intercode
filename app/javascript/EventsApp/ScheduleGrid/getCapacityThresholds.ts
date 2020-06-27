import { ScheduleGridEventFragmentFragment } from '../../graphqlQueries.generated';

export default function getCapacityThresholds(
  registrationPolicy: NonNullable<ScheduleGridEventFragmentFragment['registration_policy']>,
) {
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
