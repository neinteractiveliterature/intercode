import React from 'react';
import pluralizeWithCount from '../../pluralizeWithCount';

export function calculateAvailability(event, signupCountData) {
  let totalSlots;
  let signupCount;
  if (event.registration_policy.total_slots > 0) {
    signupCount = signupCountData.getConfirmedLimitedSignupCount(event);
    totalSlots = event.registration_policy.total_slots;
  } else if (event.registration_policy.only_uncounted) {
    signupCount = signupCountData.getNotCountedConfirmedSignupCount();
    totalSlots = event.registration_policy.total_slots_including_not_counted;
  }

  return {
    totalSlots,
    signupCount,
    remainingCapacity: totalSlots - signupCount,
    availabilityFraction: 1.0 - (signupCount / totalSlots),
    unlimited: !event.registration_policy.slots_limited,
    waitlistCount: signupCountData.getWaitlistCount(),
  };
}

export function describeAvailability(event, signupCountData) {
  if (signupCountData.runFull(event)) {
    return (
      <>
        <strong>Full</strong>
        <span className="text-muted">
          {' ('}
          {event.registration_policy.total_slots}
          {' slots)'}
        </span>
      </>
    );
  }

  const {
    unlimited, totalSlots, remainingCapacity,
  } = calculateAvailability(event, signupCountData);

  if (unlimited) {
    return 'Unlimited slots';
  }

  if (totalSlots === 0) {
    return null;
  }

  return `${remainingCapacity} of ${pluralizeWithCount('slot', totalSlots)} left`;
}

export function describeWaitlist(event, signupCountData) {
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
