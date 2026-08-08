import { fireEvent } from '@testing-library/react';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, waitFor } from '../testUtils';
import CreateSignupRunCard from '../../../app/javascript/SignupModeration/CreateSignupRunCard';
import {
  CreateSignupRunCardQueryData,
  CreateSignupRunCardQueryDocument,
} from '../../../app/javascript/SignupModeration/queries.generated';
import {
  CreateUserSignupDocument,
  CreateUserSignupMutationData,
} from '../../../app/javascript/SignupModeration/mutations.generated';
import { SignupMode } from '../../../app/javascript/graphqlTypes.generated';

describe('CreateSignupRunCard', () => {
  const buildQueryData = (): CreateSignupRunCardQueryData => ({
    __typename: 'Query',
    currentAbility: {
      __typename: 'Ability',
      can_read_schedule: true,
      can_read_event_signups: true,
      can_update_event: false,
    },
    convention: {
      __typename: 'Convention',
      id: '1',
      signup_rounds: [],
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        length_seconds: 14400,
        private_signup_list: false,
        can_play_concurrently: false,
        registration_policy: {
          __typename: 'RegistrationPolicy',
          slots_limited: true,
          prevent_no_preference_signups: false,
          total_slots_including_not_counted: 10,
          buckets: [
            {
              __typename: 'RegistrationPolicyBucket',
              id: '1',
              key: 'player',
              name: 'Player',
              description: 'Regular player',
              not_counted: false,
              slots_limited: true,
              anything: false,
              minimum_slots: 0,
              total_slots: 10,
            },
          ],
        },
        team_members: [],
        event_category: { __typename: 'EventCategory', id: '1', team_member_name: 'GM', teamMemberNamePlural: 'GMs' },
        runs: [
          {
            __typename: 'Run',
            id: '1',
            title_suffix: 'Friday Night',
            starts_at: '2025-01-01T19:00:00Z',
            current_ability_can_signup_summary_run: false,
            grouped_signup_counts: [],
            rooms: [],
            my_signups: [],
            my_signup_requests: [],
            my_signup_ranked_choices: [],
          },
        ],
        ticket_types: [],
      },
      user_con_profile: {
        __typename: 'UserConProfile',
        id: '2',
        name_without_nickname: 'Test User',
        signups: [],
        signup_constraints: { __typename: 'UserSignupConstraints', at_maximum_signups: false },
        signup_requests: [],
      },
    },
  });

  it('signs up for the specific bucket that was clicked, submitting its id, not its key', async () => {
    const queryMock: MockLink.MockedResponse<CreateSignupRunCardQueryData> = {
      request: { query: CreateSignupRunCardQueryDocument, variables: { userConProfileId: '2', eventId: '1' } },
      result: { data: buildQueryData() },
    };

    const mutationCalled = vi.fn();
    const createSignupMock: MockLink.MockedResponse<CreateUserSignupMutationData> = {
      request: {
        query: CreateUserSignupDocument,
        variables: { runId: '1', userConProfileId: '2', requestedBucketId: '1', noRequestedBucket: false },
      },
      result: () => {
        mutationCalled();
        return {
          data: {
            __typename: 'Mutation',
            createUserSignup: { __typename: 'CreateUserSignupPayload', clientMutationId: null },
          },
        };
      },
    };

    // client.resetStore() after a successful signup refetches the active query.
    const { getByRole } = await render(<CreateSignupRunCard eventId="1" runId="1" userConProfileId="2" />, {
      apolloMocks: [queryMock, queryMock, createSignupMock],
      appRootContextValue: { signupMode: SignupMode.Moderated },
    });

    const signupButton = await waitFor(() => getByRole('button', { name: /Sign up now/i }));
    fireEvent.click(signupButton);

    await waitFor(() => expect(mutationCalled).toHaveBeenCalledTimes(1));
  });
});
