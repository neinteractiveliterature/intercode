import { MockLink } from '@apollo/client/testing';

import { renderRoute, waitFor } from '../testUtils';
import {
  Component as SignupModerationQueue,
  loader,
} from '../../../app/javascript/SignupModeration/SignupModerationQueue';
import {
  SignupModerationQueuePageQueryData,
  SignupModerationQueuePageQueryDocument,
  SignupModerationQueueQueryData,
  SignupModerationQueueQueryDocument,
  SignupModerationSignupRequestFieldsFragment,
} from '../../../app/javascript/SignupModeration/queries.generated';
import { SignupRequestState } from '../../../app/javascript/graphqlTypes.generated';

describe('SignupModerationQueue', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const buildPageLoaderData = (): SignupModerationQueuePageQueryData => ({
    __typename: 'Query',
    convention: { __typename: 'Convention', id: '1', signup_rounds: [] },
  });

  const buildSignupRequest = (requestedBucket: { id: string } | null): SignupModerationSignupRequestFieldsFragment => ({
    __typename: 'SignupRequest',
    id: '1',
    state: SignupRequestState.Pending,
    created_at: '2025-01-01T00:00:00Z',
    requested_bucket: requestedBucket && { __typename: 'RegistrationPolicyBucket', id: requestedBucket.id },
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '1',
      name: 'Test User',
      name_inverted: 'User, Test',
      name_without_nickname: 'Test User',
      gravatar_enabled: false,
      gravatar_url: '',
    },
    replace_signup: null,
    result_signup: null,
    signup_ranked_choice: null,
    target_run: {
      __typename: 'Run',
      id: '1',
      title_suffix: null,
      starts_at: '2025-01-01T19:00:00Z',
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        length_seconds: 14400,
        registration_policy: {
          __typename: 'RegistrationPolicy',
          prevent_no_preference_signups: false,
          buckets: [
            {
              __typename: 'RegistrationPolicyBucket',
              id: '1',
              key: 'player',
              name: 'Player',
              total_slots: 10,
              slots_limited: true,
              anything: false,
              not_counted: false,
            },
            {
              __typename: 'RegistrationPolicyBucket',
              id: '2',
              key: 'gm',
              name: 'GM',
              total_slots: 2,
              slots_limited: true,
              anything: false,
              not_counted: false,
            },
          ],
        },
      },
      grouped_signup_counts: [],
    },
  });

  const buildQueueQueryData = (
    entries: SignupModerationSignupRequestFieldsFragment[],
  ): SignupModerationQueueQueryData => ({
    __typename: 'Query',
    convention: {
      __typename: 'Convention',
      id: '1',
      signup_requests_paginated: { __typename: 'SignupRequestsPagination', total_pages: 1, entries },
    },
  });

  const renderQueue = async (requestedBucket: { id: string } | null) => {
    const pageMock: MockLink.MockedResponse<SignupModerationQueuePageQueryData> = {
      request: { query: SignupModerationQueuePageQueryDocument, variables: {} },
      result: { data: buildPageLoaderData() },
    };
    const queueMock: MockLink.MockedResponse<SignupModerationQueueQueryData> = {
      request: {
        query: SignupModerationQueueQueryDocument,
        variables: { page: 1, perPage: 20, filters: {}, sort: [] },
      },
      result: { data: buildQueueQueryData([buildSignupRequest(requestedBucket)]) },
    };

    const result = await renderRoute([{ path: '/signup_moderation/queue', loader, Component: SignupModerationQueue }], {
      apolloMocks: [pageMock, queueMock],
      initialEntries: ['/signup_moderation/queue'],
    });

    await waitFor(() => expect(result.getByText('User, Test')).toBeTruthy());
    return result;
  };

  it("shows the requested bucket's name, matched by id, when one is present", async () => {
    // key intentionally does not match any of this run's actual bucket keys, to confirm this is
    // matched by id, not any key-based coincidence.
    const { container } = await renderQueue({ id: '2' });

    expect(container.textContent).toContain('GM');
  });

  it('shows no preference when there is no requested bucket', async () => {
    const { getByText } = await renderQueue(null);

    expect(getByText(/No preference/)).toBeTruthy();
  });

  it('shows no preference when the requested bucket id does not match any of the run’s buckets', async () => {
    const { getByText } = await renderQueue({ id: 'removed-bucket' });

    expect(getByText(/No preference/)).toBeTruthy();
  });
});
