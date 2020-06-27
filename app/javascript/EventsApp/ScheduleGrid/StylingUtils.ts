import classNames from 'classnames';

import getFullnessClass from './getFullnessClass';
import { PIXELS_PER_LANE, LANE_GUTTER_HEIGHT } from './LayoutConstants';
import { SignupState, SignupRequestState, ScheduleGridEventFragmentFragment } from '../../graphqlQueries';
import ScheduleGridConfig from './ScheduleGridConfig';
import SignupCountData, { EventForSignupCountData } from '../SignupCountData';
import RunDimensions from './PCSG/RunDimensions';
import ScheduleLayoutResult from './PCSG/ScheduleLayoutResult';

export function userSignupStatus(
  run: {
    my_signups: { state: SignupState }[],
    my_signup_requests: { state: SignupRequestState }[],
  },
) {
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
  event: {
    fake?: boolean,
    registration_policy: ScheduleGridEventFragmentFragment['registration_policy'],
  },
  signupStatus?: SignupState,
  config: ScheduleGridConfig,
  signupCountData: SignupCountData,
  unlimited: boolean,
};

export function getRunClassName({
  event, signupStatus, config, signupCountData, unlimited,
}: GetRunClassNameOptions) {
  return classNames(
    'schedule-grid-event',
    'small',
    (
      config.classifyEventsBy === 'fullness'
        ? getFullnessClass(event, signupCountData)
        : null
    ),
    {
      'signed-up': config.showSignedUp && signupStatus != null,
      'zero-capacity': (
        event.registration_policy
        && event.registration_policy.total_slots_including_not_counted === 0
      ),
      full: (
        config.classifyEventsBy !== 'fullness'
        && event.registration_policy
        && signupCountData.runFull(event)
        && signupStatus == null
      ),
      fake: event.fake,
      unlimited,
    },
  );
}

export type GetRunPositioningStylesOptions = {
  runDimensions: RunDimensions,
  layoutResult: ScheduleLayoutResult,
};

export function getRunPositioningStyles(
  { runDimensions, layoutResult }: GetRunPositioningStylesOptions,
) {
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

type GetEventCategoryStylesOptions = {
  eventCategory: {
    default_color: string,
    signed_up_color: string,
    full_color: string,
  },
  variant: EventStyleVariant,
};

export function getEventCategoryStyles(
  { eventCategory, variant }: GetEventCategoryStylesOptions,
) {
  const color = eventCategory[`${variant}_color`];

  if (color) {
    if (variant === 'signed_up') {
      return { backgroundColor: color, borderColor: color };
    }

    return {
      backgroundColor: color,
      borderColor: eventCategory.signed_up_color,
    };
  }

  return {};
}

type GetRunClassificationStylesOptions = {
  config: ScheduleGridConfig,
  eventCategory: GetEventCategoryStylesOptions['eventCategory'],
  signupCountData: SignupCountData,
  event: EventForSignupCountData,
  signupStatus?: SignupState | null,
};

export function getRunClassificationStyles({
  config, eventCategory, signupCountData, event, signupStatus,
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

export type GetRunStyleOptions = GetRunClassificationStylesOptions
& GetRunPositioningStylesOptions
& {
  disableDetailsPopup: boolean,
};

export function getRunStyle({
  event, eventCategory, signupStatus, config, signupCountData, runDimensions,
  layoutResult, disableDetailsPopup,
}: GetRunStyleOptions) {
  return {
    cursor: (disableDetailsPopup ? null : 'pointer'),
    ...getRunPositioningStyles({ runDimensions, layoutResult }),
    ...getRunClassificationStyles({
      event, eventCategory, signupStatus, config, signupCountData,
    }),
  };
}
