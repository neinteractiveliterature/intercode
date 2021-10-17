import SignupCountData, { EventForSignupCountData } from '../SignupCountData';
import getCapacityThresholds, {
  RegistrationPolicyForCapacityThresholds,
} from './getCapacityThresholds';

export default function getFullnessClass(
  event: {
    registration_policy?:
      | null
      | (EventForSignupCountData['registration_policy'] &
          RegistrationPolicyForCapacityThresholds & {
            total_slots_including_not_counted?: null | number;
            only_uncounted?: null | boolean;
          });
  },
  signupCountData: Pick<
    SignupCountData,
    'getNotCountedConfirmedSignupCount' | 'getConfirmedLimitedSignupCount'
  >,
): string {
  if (!event.registration_policy) {
    return 'event-fullness-no-slots';
  }

  if (!event.registration_policy.slots_limited) {
    return 'event-fullness-unlimited';
  }

  if (event.registration_policy.total_slots_including_not_counted === 0) {
    return 'event-fullness-no-slots';
  }

  const thresholds = getCapacityThresholds(event.registration_policy);
  const signupCount = event.registration_policy.only_uncounted
    ? signupCountData.getNotCountedConfirmedSignupCount()
    : signupCountData.getConfirmedLimitedSignupCount(event);

  if (signupCount >= (thresholds.total_slots ?? 0)) {
    return 'event-fullness-full';
  }

  if (signupCount >= (thresholds.preferred_slots ?? 0)) {
    return 'event-fullness-preferred';
  }

  if (signupCount >= (thresholds.minimum_slots ?? 0)) {
    return 'event-fullness-minimum';
  }

  return 'event-fullness-below-minimum';
}
