import { MockLink } from '@apollo/client/testing';

import { renderRoute, waitFor } from '../../../testUtils';
import { Component as EditSignup } from '../../../../../app/javascript/EventsApp/SignupAdmin/$id/route';
import { singleSignupLoader } from '../../../../../app/javascript/EventsApp/SignupAdmin/loaders';
import {
  AdminSignupQueryData,
  AdminSignupQueryDocument,
} from '../../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import {
  SignupAutomationMode,
  SignupMode,
  SignupState,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../../../app/javascript/graphqlTypes.generated';
import { NamedRoute } from '../../../../../app/javascript/AppRouter';

describe('EditSignup', () => {
  type Signup = AdminSignupQueryData['convention']['signup'];

  const buildSignup = (overrides: Partial<Signup> = {}): Signup => ({
    __typename: 'Signup',
    id: '1',
    state: SignupState.Confirmed,
    counted: true,
    bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
    requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
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

  const buildQueryData = (signup: Signup): AdminSignupQueryData => ({
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
      signup: signup,
    },
  });

  const renderEditSignup = async (signup: Signup) => {
    const mocks: MockLink.MockedResponse<AdminSignupQueryData>[] = [
      {
        request: { query: AdminSignupQueryDocument, variables: { id: '1' } },
        result: { data: buildQueryData(signup) },
      },
    ];

    const result = await renderRoute(
      [
        {
          path: '/events/:eventId/runs/:runId/admin_signups/:id',
          id: NamedRoute.EditSignup,
          loader: singleSignupLoader,
          Component: EditSignup,
        },
      ],
      { apolloMocks: mocks, initialEntries: ['/events/1/runs/1/admin_signups/1'] },
    );

    await waitFor(() => expect(result.getByText(/Signup bucket:/)).toBeTruthy());
    return result;
  };

  it('shows just the bucket name when the current and requested buckets match by id', async () => {
    const { container } = await renderEditSignup(
      buildSignup({
        bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
        requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
      }),
    );

    expect(container.textContent).toContain('Signup bucket: Player');
    expect(container.textContent).not.toContain('requested');
  });

  it('shows the requested bucket name when it differs from the current bucket, matched by id', async () => {
    const { container } = await renderEditSignup(
      buildSignup({
        bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
        requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '2' },
      }),
    );

    expect(container.textContent).toContain('Signup bucket: Player (requested GM)');
  });

  it('shows no preference when there is no current or requested bucket and no team member', async () => {
    const { container } = await renderEditSignup(
      buildSignup({
        bucket: null,
        requested_bucket: null,
      }),
    );

    expect(container.textContent).toContain('Signup bucket: none (no preference)');
  });

  it('shows the change-bucket link for a confirmed signup when the ability allows it', async () => {
    const { getByLabelText } = await renderEditSignup(buildSignup({ state: SignupState.Confirmed }));

    expect(getByLabelText('Change signup bucket')).toBeTruthy();
  });

  it('does not show the change-bucket link for a waitlisted signup', async () => {
    const { queryByLabelText } = await renderEditSignup(buildSignup({ state: SignupState.Waitlisted }));

    expect(queryByLabelText('Change signup bucket')).toBeFalsy();
  });
});
