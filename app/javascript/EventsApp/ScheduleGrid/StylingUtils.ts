import classNames from 'classnames';
import { CSSProperties } from 'react';
import { assertNever } from 'assert-never';

import getFullnessClass from './getFullnessClass';
import { PIXELS_PER_LANE, LANE_GUTTER_HEIGHT } from './LayoutConstants';
import { SignupState, SignupRequestState } from '../../graphqlTypes.generated';
import { ScheduleGridConfig } from './ScheduleGridConfig';
import SignupCountData, { EventForSignupCountData } from '../SignupCountData';
import { RunDimensions, ScheduleLayoutResult } from './ScheduleLayout/ScheduleLayoutBlock';
import { RegistrationPolicyForCapacityThresholds } from './getCapacityThresholds';

export enum SignupStatus {
  Confirmed = 'confirmed',
  Waitlisted = 'waitlisted',
  Withdrawn = 'withdrawn',
  RequestPending = 'request_pending',
}

export function userSignupStatus(run: {
  my_signups: { state: SignupState }[];
  my_signup_requests: { state: SignupRequestState }[];
}): SignupStatus | null {
  if (run.my_signups.some((signup) => signup.state === SignupState.Confirmed)) {
    return SignupStatus.Confirmed;
  }

  if (run.my_signups.some((signup) => signup.state === SignupState.Waitlisted)) {
    return SignupStatus.Waitlisted;
  }

  if (
    run.my_signup_requests.some(
      (signupRequest) => signupRequest.state === SignupRequestState.Pending,
    )
  ) {
    return SignupStatus.RequestPending;
  }

  return null;
}

export type GetRunClassNameOptions = {
  event: Omit<EventForSignupCountData, 'registration_policy'> & {
    fake?: boolean;
    registration_policy?:
      | null
      | (EventForSignupCountData['registration_policy'] &
          RegistrationPolicyForCapacityThresholds & {
            total_slots_including_not_counted?: null | number;
          });
  };
  signupStatus?: SignupStatus;
  config: Pick<ScheduleGridConfig, 'classifyEventsBy' | 'showSignedUp'>;
  signupCountData: Pick<
    SignupCountData,
    'runFull' | 'getConfirmedLimitedSignupCount' | 'getNotCountedConfirmedSignupCount'
  >;
  unlimited: boolean;
  runDimensions: RunDimensions;
};

export function getRunClassName({
  event,
  signupStatus,
  config,
  signupCountData,
  unlimited,
  runDimensions,
}: GetRunClassNameOptions): string {
  return classNames(
    'schedule-grid-event',
    'small',
    config.classifyEventsBy === 'fullness' ? getFullnessClass(event, signupCountData) : null,
    {
      'signed-up': config.showSignedUp && signupStatus != null,
      'zero-capacity':
        event.registration_policy &&
        event.registration_policy.total_slots_including_not_counted === 0,
      full:
        config.classifyEventsBy !== 'fullness' &&
        signupCountData.runFull(event) &&
        signupStatus == null,
      fake: event.fake,
      unlimited,
      'truncated-start': runDimensions.fullTimespan.start < runDimensions.timespan.start,
      'truncated-finish': runDimensions.fullTimespan.finish > runDimensions.timespan.finish,
    },
  );
}

export type GetRunPositioningStylesOptions = {
  runDimensions: RunDimensions;
  layoutResult: ScheduleLayoutResult;
};

export function getRunPositioningStyles({
  runDimensions,
  layoutResult,
}: GetRunPositioningStylesOptions): CSSProperties {
  return {
    top: `${(runDimensions.laneIndex / layoutResult.laneCount) * 100.0}%`,
    height: PIXELS_PER_LANE - LANE_GUTTER_HEIGHT,
    left: `${runDimensions.timeAxisStartPercent}%`,
    width: `${runDimensions.timeAxisSizePercent}%`,
    position: 'absolute',
    zIndex: runDimensions.laneIndex,
  };
}

export type EventStyleVariant = 'default' | 'signed_up' | 'full';

export type GetEventCategoryStylesOptions = {
  eventCategory: {
    default_color?: string | null;
    signed_up_color?: string | null;
    full_color?: string | null;
  };
  variant: EventStyleVariant;
};

function getColorVariant(
  eventCategory: GetEventCategoryStylesOptions['eventCategory'],
  variant: GetEventCategoryStylesOptions['variant'],
) {
  switch (variant) {
    case 'default':
      return eventCategory.default_color;
    case 'signed_up':
      return eventCategory.signed_up_color;
    case 'full':
      return eventCategory.full_color;
    default:
      assertNever(variant, true);
      return undefined;
  }
}

export function getEventCategoryStyles({
  eventCategory,
  variant,
}: GetEventCategoryStylesOptions): Partial<
  Pick<CSSStyleDeclaration, 'backgroundColor' | 'borderColor'>
> {
  const color = getColorVariant(eventCategory, variant);

  if (color) {
    if (variant === 'signed_up') {
      return { backgroundColor: color, borderColor: color };
    }

    return {
      backgroundColor: color,
      borderColor: eventCategory.signed_up_color ?? undefined,
    };
  }

  return {};
}

export type GetRunClassificationStylesOptions = {
  config: Pick<ScheduleGridConfig, 'classifyEventsBy'>;
  eventCategory: GetEventCategoryStylesOptions['eventCategory'];
  signupCountData: Pick<SignupCountData, 'runFull'>;
  event: EventForSignupCountData;
  signupStatus?: SignupStatus | null;
};

export function getRunClassificationStyles({
  config,
  eventCategory,
  signupCountData,
  event,
  signupStatus,
}: GetRunClassificationStylesOptions): CSSProperties {
  if (config.classifyEventsBy === 'category') {
    let variant: EventStyleVariant = 'default';
    if (signupStatus != null) {
      variant = 'signed_up';
    } else if (signupCountData.runFull(event)) {
      variant = 'full';
    }

    return getEventCategoryStyles({ eventCategory, variant });
  }

  return {};
}

export type GetRunStyleOptions = GetRunClassificationStylesOptions &
  GetRunPositioningStylesOptions & {
    disableDetailsPopup: boolean;
  };

export function getRunStyle({
  event,
  eventCategory,
  signupStatus,
  config,
  signupCountData,
  runDimensions,
  layoutResult,
  disableDetailsPopup,
}: GetRunStyleOptions): CSSProperties {
  return {
    cursor: disableDetailsPopup ? undefined : 'pointer',
    ...getRunPositioningStyles({ runDimensions, layoutResult }),
    ...getRunClassificationStyles({
      event,
      eventCategory,
      signupStatus,
      config,
      signupCountData,
    }),
  };
}
