import { SchedulingUi, SignupRequestState, SignupState } from '../../../../app/javascript/graphqlTypes.generated';
import Schedule, { ScheduleEvent } from '../../../../app/javascript/EventsApp/ScheduleGrid/Schedule';
import { ScheduleGridConfig } from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleGridConfig';
import { ScheduleGridEventCategory } from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleGridTypes';

export const TIMEZONE_NAME = 'America/New_York';

export function buildCategory(name: string, id = `category-${name}`): ScheduleGridEventCategory {
  return {
    __typename: 'EventCategory',
    id,
    name,
    default_color: null,
    full_color: null,
    signed_up_color: null,
    team_member_name: 'team member',
    teamMemberNamePlural: 'team members',
    scheduling_ui: SchedulingUi.Regular,
    event_form: { __typename: 'Form', id: `form-${id}`, form_sections: [] },
  };
}

export type RunInput = {
  id: string;
  startsAt: string;
  rooms?: string[];
  mySignupState?: SignupState;
  myRequestState?: SignupRequestState;
};

export type EventInput = {
  id: string;
  title: string;
  lengthSeconds?: number;
  category?: ScheduleGridEventCategory;
  canPlayConcurrently?: boolean;
  myRating?: number | null;
  buckets?: { id: string; slotsLimited: boolean; totalSlots: number | null; notCounted?: boolean }[];
  runs: RunInput[];
};

export function buildEvent({
  id,
  title,
  lengthSeconds = 3 * 60 * 60,
  category = buildCategory('Larp'),
  canPlayConcurrently = false,
  myRating = null,
  buckets,
  runs,
}: EventInput): ScheduleEvent {
  return {
    __typename: 'Event',
    id,
    title,
    length_seconds: lengthSeconds,
    can_play_concurrently: canPlayConcurrently,
    my_rating: myRating,
    event_category: category,
    registration_policy: buckets
      ? {
          slots_limited: buckets.some((bucket) => bucket.slotsLimited),
          buckets: buckets.map((bucket) => ({
            __typename: 'RegistrationPolicyBucket' as const,
            id: bucket.id,
            key: bucket.id,
            not_counted: bucket.notCounted ?? false,
            total_slots: bucket.totalSlots,
            slots_limited: bucket.slotsLimited,
          })),
        }
      : null,
    runs: runs.map((run) => ({
      __typename: 'Run' as const,
      id: run.id,
      starts_at: run.startsAt,
      schedule_note: null,
      title_suffix: null,
      confirmed_signup_count: 0,
      not_counted_signup_count: 0,
      room_names: run.rooms ?? [],
      grouped_signup_counts: [],
      my_signups: run.mySignupState
        ? [{ __typename: 'Signup' as const, id: `signup-${run.id}`, state: run.mySignupState }]
        : [],
      my_signup_requests: run.myRequestState
        ? [{ __typename: 'SignupRequest' as const, id: `request-${run.id}`, state: run.myRequestState }]
        : [],
      my_signup_ranked_choices: [],
    })),
  };
}

export const categoryConfig: ScheduleGridConfig = {
  key: 'test-by-category',
  titlei18nKey: 'events.schedule.byCategory.title' as ScheduleGridConfig['titlei18nKey'],
  icon: 'bi-grid',
  classifyEventsBy: 'category',
  groupEventsBy: 'category',
  categoryGroups: [
    { id: 'larps', match: [{ categoryName: 'Larp' }] },
    { id: 'panels', match: [{ categoryName: 'Panel' }] },
    { id: 'other', match: [{ allRemaining: true }], flexGrow: true },
  ],
};

export const roomConfig: ScheduleGridConfig = {
  key: 'test-by-room',
  titlei18nKey: 'events.schedule.byRoom.title' as ScheduleGridConfig['titlei18nKey'],
  icon: 'bi-door-open',
  classifyEventsBy: 'category',
  groupEventsBy: 'room',
  filterEmptyGroups: true,
};

export function buildSchedule(
  events: ScheduleEvent[],
  overrides: Partial<{
    config: ScheduleGridConfig;
    hideConflicts: boolean;
    myRatingFilter: number[];
  }> = {},
): Schedule {
  return new Schedule({
    config: overrides.config ?? categoryConfig,
    events,
    hideConflicts: overrides.hideConflicts ?? false,
    myRatingFilter: overrides.myRatingFilter,
    timezoneName: TIMEZONE_NAME,
  });
}
