import { Outlet } from 'react-router';
import { MockLink } from '@apollo/client/testing';
import { fireEvent } from '@testing-library/react';

import { renderRoute, waitFor } from '../../../testUtils';
import {
  Component as ChangeBucketModal,
  action as changeBucketAction,
} from '../../../../../app/javascript/EventsApp/SignupAdmin/$id/change_bucket';
import { singleSignupLoader } from '../../../../../app/javascript/EventsApp/SignupAdmin/loaders';
import {
  AdminSignupQueryData,
  AdminSignupQueryDocument,
} from '../../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import {
  ChangeSignupBucketDocument,
  ChangeSignupBucketMutationData,
} from '../../../../../app/javascript/EventsApp/SignupAdmin/mutations.generated';
import {
  SignupAutomationMode,
  SignupMode,
  SignupState,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../../../app/javascript/graphqlTypes.generated';
import { NamedRoute } from '../../../../../app/javascript/AppRouter';

describe('ChangeBucketModal', () => {
  type Signup = AdminSignupQueryData['convention']['signup'];

  const buildSignup = (overrides: Partial<Signup> = {}): Signup => ({
    __typename: 'Signup',
    id: '1',
    state: SignupState.Confirmed,
    counted: true,
    bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
    requested_bucket: null,
    run: {
      __typename: 'Run',
      id: '1',
      title_suffix: null,
      starts_at: '2025-01-01T19:00:00Z',
      ends_at: '2025-01-01T23:00:00Z',
      rooms: [],
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        event_category: { __typename: 'EventCategory', id: '1', team_member_name: 'GM', teamMemberNamePlural: 'GMs' },
        registration_policy: {
          __typename: 'RegistrationPolicy',
          buckets: [
            { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player', name: 'Player', anything: false },
            { __typename: 'RegistrationPolicyBucket', id: '2', key: 'gm', name: 'GM', anything: false },
          ],
        },
        team_members: [],
      },
    },
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '1',
      name_without_nickname: 'Test User',
      nickname: null,
      birth_date: null,
      email: null,
      address: null,
      city: null,
      state: null,
      zipcode: null,
      country: null,
      mobile_phone: null,
      gravatar_enabled: false,
      gravatar_url: '',
    },
    ...overrides,
  });

  const buildLoaderData = (signup: Signup): AdminSignupQueryData => ({
    __typename: 'Query',
    currentAbility: {
      __typename: 'Ability',
      can_update_bucket_signup: true,
      can_force_confirm_signup: true,
      can_update_counted_signup: true,
    },
    convention: {
      __typename: 'Convention',
      id: '1',
      name: 'Test Convention',
      starts_at: null,
      ends_at: null,
      signup_mode: SignupMode.Moderated,
      signup_automation_mode: SignupAutomationMode.RankedChoice,
      site_mode: SiteMode.Convention,
      timezone_name: 'America/New_York',
      timezone_mode: TimezoneMode.ConventionLocal,
      ticket_name: 'ticket',
      ticket_mode: TicketMode.Disabled,
      event_categories: [],
      signup,
    },
  });

  const buildMutationData = (
    signup: Signup,
    newBucket: { id: string; key: string },
  ): ChangeSignupBucketMutationData => ({
    __typename: 'Mutation',
    updateSignupBucket: {
      __typename: 'UpdateSignupBucketPayload',
      signup: {
        __typename: 'Signup',
        id: signup.id,
        state: signup.state,
        counted: signup.counted,
        bucket: { __typename: 'RegistrationPolicyBucket', id: newBucket.id, key: newBucket.key },
        requested_bucket: signup.requested_bucket,
        user_con_profile: signup.user_con_profile,
        run: {
          __typename: 'Run',
          id: signup.run.id,
          title_suffix: signup.run.title_suffix,
          starts_at: signup.run.starts_at,
          ends_at: signup.run.ends_at,
          current_ability_can_signup_summary_run: false,
          rooms: [],
          event: signup.run.event,
          grouped_signup_counts: [],
          my_signups: [],
          my_signup_requests: [],
          my_signup_ranked_choices: [],
        },
      },
    },
  });

  const renderChangeBucketModal = async (signup: Signup, mocks: MockLink.MockedResponse[] = []) => {
    const allMocks: MockLink.MockedResponse[] = [
      {
        request: { query: AdminSignupQueryDocument, variables: { id: '1' } },
        result: { data: buildLoaderData(signup) },
      },
      ...mocks,
    ];

    const result = await renderRoute(
      [
        {
          path: '/events/:eventId/runs/:runId/admin_signups/:id',
          id: NamedRoute.EditSignup,
          loader: singleSignupLoader,
          Component: () => <Outlet />,
          children: [{ path: 'change_bucket', action: changeBucketAction, Component: ChangeBucketModal }],
        },
      ],
      { apolloMocks: allMocks, initialEntries: ['/events/1/runs/1/admin_signups/1/change_bucket'] },
    );

    await waitFor(() => expect(result.getByRole('button', { name: 'OK' })).toBeTruthy());
    return result;
  };

  it("pre-selects the signup's current bucket by key, not id", async () => {
    const { getByLabelText } = await renderChangeBucketModal(
      buildSignup({ bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' } }),
    );

    expect((getByLabelText('Player (current)') as HTMLInputElement).checked).toBe(true);
    expect((getByLabelText('GM') as HTMLInputElement).checked).toBe(false);
  });

  it('submits the newly selected bucket key when confirmed', async () => {
    const signup = buildSignup({ bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' } });
    const mutationMock: MockLink.MockedResponse<ChangeSignupBucketMutationData> = {
      request: {
        query: ChangeSignupBucketDocument,
        variables: { signupId: '1', bucketKey: 'gm' },
      },
      result: { data: buildMutationData(signup, { id: '2', key: 'gm' }) },
    };

    const { getByLabelText, getByRole, queryByRole } = await renderChangeBucketModal(signup, [mutationMock]);

    fireEvent.click(getByLabelText('GM'));
    fireEvent.click(getByRole('button', { name: 'OK' }));

    // A successful submit navigates away, unmounting the modal's OK button -- if the fetcher had
    // instead submitted a mismatched bucketKey (e.g. an id instead of a key), MockLink would have
    // no matching mock, the action would return an error, and the button would stay put.
    await waitFor(() => expect(queryByRole('button', { name: 'OK' })).toBeFalsy());
  });
});
