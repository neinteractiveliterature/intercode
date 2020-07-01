import React, { ReactNode } from 'react';
import pluralizeWithCount from '../../pluralizeWithCount';
import { EventForSchedule } from './Schedule';
import SignupCountData from '../SignupCountData';

export type RunAvailability = {
  totalSlots: number | undefined,
  signupCount: number | undefined,
  remainingCapacity: number | undefined,
  availabilityFraction: number | undefined,
  unlimited: boolean,
  waitlistCount: number,
};

export interface LimitedRunAvailability extends RunAvailability {
  unlimited: false;
  totalSlots: number;
  signupCount: number;
  remainingCapacity: number;
  availabilityFraction: number;
}

export function runAvailabilityIsLimited(
  availability: RunAvailability,
): availability is LimitedRunAvailability {
  return (
    availability.unlimited === false
    && availability.totalSlots != null
    && availability.signupCount != null
    && availability.remainingCapacity != null
    && availability.availabilityFraction != null
  );
}

export function calculateAvailability(
  event: EventForSchedule, signupCountData: SignupCountData,
): RunAvailability {
  let totalSlots: number = 0;
  let signupCount: number = 0;
  if (event.registration_policy && event.registration_policy.total_slots > 0) {
    signupCount = signupCountData.getConfirmedLimitedSignupCount(event);
    totalSlots = event.registration_policy.total_slots;
  } else if (event.registration_policy && event.registration_policy.only_uncounted) {
    signupCount = signupCountData.getNotCountedConfirmedSignupCount();
    totalSlots = event.registration_policy.total_slots_including_not_counted;
  }

  return {
    totalSlots,
    signupCount,
    remainingCapacity: totalSlots - signupCount,
    availabilityFraction: 1.0 - (signupCount / totalSlots),
    unlimited: event.registration_policy ? !event.registration_policy.slots_limited : false,
    waitlistCount: signupCountData.getWaitlistCount(),
  };
}

export function describeAvailability(
  event: EventForSchedule, signupCountData: SignupCountData,
): ReactNode {
  if (signupCountData.runFull(event)) {
    return (
      <>
        <strong>Full</strong>
        <span className="text-muted">
          {' ('}
          {event.registration_policy!.total_slots}
          {' slots)'}
        </span>
      </>
    );
  }

  const {
    unlimited, totalSlots, signupCount,
  } = calculateAvailability(event, signupCountData);

  if (unlimited) {
    return 'Unlimited slots';
  }

  if (totalSlots === 0) {
    return null;
  }

  const displayCount = (signupCount && totalSlots && signupCount > totalSlots)
    ? totalSlots
    : signupCount;

  return `${displayCount} of ${pluralizeWithCount('slot', totalSlots)} filled`;
}

export function describeWaitlist(
  event: EventForSchedule, signupCountData: SignupCountData,
): ReactNode {
  if (signupCountData.runFull(event)) {
    return (
      <>
        <strong>Waitlist:</strong>
        {' '}
        {signupCountData.getWaitlistCount()}
      </>
    );
  }

  return null;
}
