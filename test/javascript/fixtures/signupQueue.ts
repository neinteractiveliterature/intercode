import {
  RankedChoiceFallbackAction,
  SignupRankedChoiceState,
  SignupState,
  TicketMode,
} from '../../../app/javascript/graphqlTypes.generated';
import { MySignupQueueQueryData } from '../../../app/javascript/EventsApp/MySignupQueue/queries.generated';

// Builders for the ranked-choice signup queue page's data

type MyProfile = NonNullable<MySignupQueueQueryData['convention']['my_profile']>;
export type QueueConstraint = MyProfile['ranked_choice_user_constraints'][number];
export type QueueSignup = MyProfile['signups'][number];
export type QueueRankedChoice = MyProfile['signup_ranked_choices'][number];

export function buildQueueConstraint(overrides: Partial<QueueConstraint> = {}): QueueConstraint {
  return {
    __typename: 'RankedChoiceUserConstraint',
    id: '1',
    start: null,
    finish: null,
    maximum_signups: 5,
    ...overrides,
  };
}

export function buildQueueSignup(overrides: Partial<QueueSignup> = {}): QueueSignup {
  return {
    __typename: 'Signup',
    id: '1',
    state: SignupState.Confirmed,
    counted: true,
    run: {
      __typename: 'Run',
      id: '1',
      starts_at: '2026-06-05T20:00:00Z',
      ends_at: '2026-06-06T00:00:00Z',
      event: { __typename: 'Event', id: '1', title: 'Big Game' },
    },
    ...overrides,
  };
}

export function buildQueueRankedChoice(overrides: Partial<QueueRankedChoice> = {}): QueueRankedChoice {
  return {
    __typename: 'SignupRankedChoice',
    id: '1',
    state: SignupRankedChoiceState.Pending,
    prioritize_waitlist: false,
    waitlist_position_cap: null,
    priority: 1,
    requested_bucket: null,
    simulated_skip_reason: null,
    target_run: {
      __typename: 'Run',
      id: '10',
      title_suffix: null,
      starts_at: '2026-06-06T20:00:00Z',
      event: {
        __typename: 'Event',
        id: '5',
        title: 'Murder Mystery',
        length_seconds: 4 * 60 * 60,
        event_category: { __typename: 'EventCategory', id: '1', name: 'Larp' },
        registration_policy: { __typename: 'RegistrationPolicy', buckets: [] },
      },
    },
    ...overrides,
  };
}

export function buildMySignupQueueData(
  profile: Partial<MyProfile> | null = {},
  overrides: Partial<MySignupQueueQueryData['convention']> = {},
): MySignupQueueQueryData {
  return {
    __typename: 'Query',
    currentAbility: { __typename: 'Ability', can_create_cms_partials: false },
    convention: {
      __typename: 'Convention',
      id: '1',
      ticket_mode: TicketMode.RequiredForSignup,
      blockPartial: null,
      signup_rounds: [],
      my_profile:
        profile == null
          ? null
          : {
              __typename: 'UserConProfile',
              id: '7',
              ranked_choice_fallback_action: RankedChoiceFallbackAction.Waitlist,
              ranked_choice_user_constraints: [],
              ticket: {
                __typename: 'Ticket',
                id: '1',
                ticket_type: { __typename: 'TicketType', id: '1', allows_event_signups: true },
              },
              signups: [],
              signup_ranked_choices: [],
              ...profile,
            },
      ...overrides,
    },
  };
}
