import { RunSignupChangesQueryData } from '../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import { SignupSpySignupChangesQueryData } from '../../../app/javascript/Reports/queries.generated';
import { SignupChangeAction, SignupState } from '../../../app/javascript/graphqlTypes.generated';

export type RunSignupChangeEntry =
  RunSignupChangesQueryData['convention']['run']['signup_changes_paginated']['entries'][number];
export type SignupSpyChangeEntry =
  SignupSpySignupChangesQueryData['convention']['signup_changes_paginated']['entries'][number];

export const signupChangeBuckets = [
  { __typename: 'RegistrationPolicyBucket' as const, id: '1', key: 'player', name: 'Player', anything: false },
  { __typename: 'RegistrationPolicyBucket' as const, id: '2', key: 'gm', name: 'GM', anything: false },
];

export const signupChangeEvent = {
  __typename: 'Event' as const,
  id: '9',
  title: 'Big Game',
  event_category: { __typename: 'EventCategory' as const, id: '4', team_member_name: 'GM' },
  registration_policy: { __typename: 'RegistrationPolicy' as const, buckets: signupChangeBuckets },
  team_members: [],
};

export function buildRunSignupChange(
  id: string,
  name: string,
  overrides: Partial<RunSignupChangeEntry> = {},
): RunSignupChangeEntry {
  return {
    __typename: 'SignupChange',
    id,
    state: SignupState.Confirmed,
    counted: true,
    action: SignupChangeAction.SelfServiceSignup,
    created_at: '2026-06-05T12:00:00Z',
    bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
    previous_signup_change: null,
    signup: { __typename: 'Signup', id: `s${id}`, requested_bucket: null },
    user_con_profile: {
      __typename: 'UserConProfile',
      id: `p${id}`,
      name_inverted: name,
      gravatar_enabled: false,
      gravatar_url: '',
    },
    ...overrides,
  };
}

export function buildSignupSpyChange(
  id: string,
  name: string,
  overrides: Partial<SignupSpyChangeEntry> = {},
): SignupSpyChangeEntry {
  return {
    ...buildRunSignupChange(id, name),
    signup: { __typename: 'Signup', id: `s${id}`, choice: 1, requested_bucket: null },
    run: { __typename: 'Run', id: '3', event: signupChangeEvent },
    ...overrides,
  };
}
