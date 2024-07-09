import { TFunction } from 'i18next';
import { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import SignupCountData from '../SignupCountData';
import { ScheduleEvent } from './Schedule';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TI = any;

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
  if (event.registration_policy?.total_slots != null && event.registration_policy?.total_slots > 0) {
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

export function describeAvailability(event: ScheduleEvent, signupCountData: SignupCountData, t: TFunction): ReactNode {
  if (signupCountData.runFull(event)) {
    return (
      <Trans i18nKey="signups.availability.full" count={event.registration_policy?.total_slots ?? 0}>
        <strong>Full</strong>
        <span className="text-muted">
          {' ('}
          {{ count: event.registration_policy?.total_slots ?? 0 } as TI}
          {' slots)'}
        </span>
      </Trans>
    );
  }

  const { unlimited, totalSlots, signupCount } = calculateAvailability(event, signupCountData);

  if (unlimited) {
    return <>{t('signups.availability.unlimited')}</>;
  }

  if (totalSlots === 0) {
    return null;
  }

  const displayCount = signupCount > totalSlots ? totalSlots : signupCount;

  return (
    <>
      {t('signups.availability.partiallyFull', {
        signupCount: displayCount,
        count: totalSlots,
      })}
    </>
  );
}

export function describeWaitlist(event: ScheduleEvent, signupCountData: SignupCountData): ReactNode {
  if (signupCountData.runFull(event)) {
    return (
      <Trans i18nKey="signups.availability.waitlistCount" count={signupCountData.getWaitlistCount()}>
        <strong>Waitlist:</strong> {{ count: signupCountData.getWaitlistCount() }}
      </Trans>
    );
  }

  return null;
}
