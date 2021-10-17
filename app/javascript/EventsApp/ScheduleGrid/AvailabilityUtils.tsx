import { ReactNode } from 'react';
import pluralizeWithCount from '../../pluralizeWithCount';
import SignupCountData from '../SignupCountData';
import { ScheduleEvent } from './Schedule';

export type ScheduleEventAvailability = {
  totalSlots: number;
  signupCount: number;
  remainingCapacity: number;
  availabilityFraction: number;
  unlimited: boolean;
  waitlistCount: number;
};

export function calculateAvailability(
  event: ScheduleEvent,
  signupCountData: SignupCountData,
): ScheduleEventAvailability {
  let totalSlots = 0;
  let signupCount = 0;
  if (
    event.registration_policy?.total_slots != null &&
    event.registration_policy?.total_slots > 0
  ) {
    signupCount = signupCountData.getConfirmedLimitedSignupCount(event);
    totalSlots = event.registration_policy?.total_slots ?? 0;
  } else if (event.registration_policy?.only_uncounted) {
    signupCount = signupCountData.getNotCountedConfirmedSignupCount();
    totalSlots = event.registration_policy?.total_slots_including_not_counted ?? 0;
  }

  return {
    totalSlots,
    signupCount,
    remainingCapacity: totalSlots - signupCount,
    availabilityFraction: 1.0 - signupCount / totalSlots,
    unlimited: !event.registration_policy?.slots_limited,
    waitlistCount: signupCountData.getWaitlistCount(),
  };
}

export function describeAvailability(
  event: ScheduleEvent,
  signupCountData: SignupCountData,
): ReactNode {
  if (signupCountData.runFull(event)) {
    return (
      <>
        <strong>Full</strong>
        <span className="text-muted">
          {' ('}
          {event.registration_policy?.total_slots ?? 0}
          {' slots)'}
        </span>
      </>
    );
  }

  const { unlimited, totalSlots, signupCount } = calculateAvailability(event, signupCountData);

  if (unlimited) {
    return 'Unlimited slots';
  }

  if (totalSlots === 0) {
    return null;
  }

  const displayCount = signupCount > totalSlots ? totalSlots : signupCount;

  return `${displayCount} of ${pluralizeWithCount('slot', totalSlots)} filled`;
}

export function describeWaitlist(
  event: ScheduleEvent,
  signupCountData: SignupCountData,
): ReactNode {
  if (signupCountData.runFull(event)) {
    return (
      <>
        <strong>Waitlist:</strong> {signupCountData.getWaitlistCount()}
      </>
    );
  }

  return null;
}
