import classNames from 'classnames';
import { CSSProperties } from 'react';

import getFullnessClass from './getFullnessClass';
import { PIXELS_PER_LANE, LANE_GUTTER_HEIGHT } from './LayoutConstants';
import { SignupState, SignupRequestState } from '../../graphqlTypes.generated';
import ScheduleGridConfig from './ScheduleGridConfig';
import SignupCountData, { EventForSignupCountData } from '../SignupCountData';
import { ScheduleGridEventFragmentFragment } from './queries.generated';
import RunDimensions from './PCSG/RunDimensions';
import ScheduleLayoutResult from './PCSG/ScheduleLayoutResult';

export enum SignupStatus {
  Confirmed = 'confirmed',
  Waitlisted = 'waitlisted',
  Withdrawn = 'withdrawn',
  RequestPending = 'request_pending',
}

export function userSignupStatus(run: {
  my_signups: { state: SignupState }[];
  my_signup_requests: { state: SignupRequestState }[];
}) {
  if (run.my_signups.some((signup) => signup.state === 'confirmed')) {
    return 'confirmed';
  }

  if (run.my_signups.some((signup) => signup.state === 'waitlisted')) {
    return 'waitlisted';
  }

  if (run.my_signup_requests.some((signupRequest) => signupRequest.state === 'pending')) {
    return 'request_pending';
  }

  return null;
}

export type GetRunClassNameOptions = {
  event: ScheduleGridEventFragmentFragment & { fake?: boolean };
  signupStatus?: SignupStatus;
  config: Pick<ScheduleGridConfig, 'classifyEventsBy' | 'showSignedUp'>;
  signupCountData: Pick<
    SignupCountData,
    'runFull' | 'getConfirmedLimitedSignupCount' | 'getNotCountedConfirmedSignupCount'
  >;
  unlimited: boolean;
};

export function getRunClassName({
  event,
  signupStatus,
  config,
  signupCountData,
  unlimited,
}: GetRunClassNameOptions) {
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
    left: `${runDimensions.timePlacement}%`,
    width: `${runDimensions.timeSpan}%`,
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

export function getEventCategoryStyles({
  eventCategory,
  variant,
}: GetEventCategoryStylesOptions): Partial<
  Pick<CSSStyleDeclaration, 'backgroundColor' | 'borderColor'>
> {
  const color = eventCategory[`${variant}_color`];

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
}: GetRunClassificationStylesOptions) {
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
