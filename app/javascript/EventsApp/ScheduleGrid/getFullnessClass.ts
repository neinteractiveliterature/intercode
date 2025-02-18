import SignupCountData, { EventForSignupCountData } from '../SignupCountData';
import getCapacityThresholds, { RegistrationPolicyForCapacityThresholds } from './getCapacityThresholds';
import styles from 'styles/schedule_grid.module.scss';

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
  signupCountData: Pick<SignupCountData, 'getNotCountedConfirmedSignupCount' | 'getConfirmedLimitedSignupCount'>,
): string {
  if (!event.registration_policy) {
    return `event-fullness-no-slots ${styles.eventFullnessNoSlots}`;
  }

  if (!event.registration_policy.slots_limited) {
    return `event-fullness-unlimited ${styles.eventFullnessUnlimited}`;
  }

  if (event.registration_policy.total_slots_including_not_counted === 0) {
    return `event-fullness-no-slots ${styles.eventFullnessNoSlots}`;
  }

  const thresholds = getCapacityThresholds(event.registration_policy);
  const signupCount = event.registration_policy.only_uncounted
    ? signupCountData.getNotCountedConfirmedSignupCount()
    : signupCountData.getConfirmedLimitedSignupCount(event);

  if (signupCount >= (thresholds.total_slots ?? 0)) {
    return `event-fullness-full ${styles.eventFullnessFull}`;
  }

  if (signupCount >= (thresholds.preferred_slots ?? 0)) {
    return `event-fullness-preferred ${styles.eventFullnessPreferred}`;
  }

  if (signupCount >= (thresholds.minimum_slots ?? 0)) {
    return `event-fullness-minimum ${styles.eventFullnessMinimum}`;
  }

  return `event-fullness-below-minimum ${styles.eventFullnessBelowMinimum}`;
}
