import { MockLink } from '@apollo/client/testing';

import { renderRoute, waitFor } from '../../testUtils';
import {
  Component as RunSignupSummary,
  loader,
} from '../../../../app/javascript/EventsApp/SignupAdmin/RunSignupSummary';
import {
  RunSignupSummaryQueryData,
  RunSignupSummaryQueryDocument,
} from '../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import {
  SignupAutomationMode,
  SignupMode,
  SignupState,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../../app/javascript/graphqlTypes.generated';

describe('RunSignupSummary', () => {
  const buildQueryData = (
    entries: RunSignupSummaryQueryData['convention']['event']['run']['signups_paginated']['entries'],
  ): RunSignupSummaryQueryData => ({
    __typename: 'Query',
    currentAbility: { __typename: 'Ability', can_read_schedule: true },
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
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        event_category: { __typename: 'EventCategory', id: '1', team_member_name: 'GM' },
        registration_policy: {
          __typename: 'RegistrationPolicy',
          buckets: [
            { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player', name: 'Player', expose_attendees: true },
          ],
        },
        team_members: [],
        runs: [{ __typename: 'Run', id: '1', starts_at: '2025-01-01T19:00:00Z' }],
        run: {
          __typename: 'Run',
          id: '1',
          signups_paginated: { __typename: 'SignupsPagination', entries },
        },
      },
    },
  });

  const renderRunSignupSummary = async (
    entries: RunSignupSummaryQueryData['convention']['event']['run']['signups_paginated']['entries'],
  ) => {
    const mocks: MockLink.MockedResponse<RunSignupSummaryQueryData>[] = [
      {
        request: { query: RunSignupSummaryQueryDocument, variables: { eventId: '1', runId: '1' } },
        result: { data: buildQueryData(entries) },
      },
    ];

    const result = await renderRoute(
      [
        {
          path: '/events/:eventId/runs/:runId/signup_summary',
          loader,
          Component: RunSignupSummary,
        },
      ],
      { apolloMocks: mocks, initialEntries: ['/events/1/runs/1/signup_summary'] },
    );

    await waitFor(() => expect(result.getByRole('table')).toBeTruthy());
    return result;
  };

  it('lists confirmed and waitlisted signups', async () => {
    const { getByText } = await renderRunSignupSummary([
      {
        __typename: 'Signup',
        id: '1',
        state: SignupState.Confirmed,
        waitlist_position: null,
        bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        user_con_profile: {
          __typename: 'UserConProfile',
          id: '1',
          name_inverted: 'One, Player',
          gravatar_enabled: false,
          gravatar_url: '',
        },
      },
      {
        __typename: 'Signup',
        id: '2',
        state: SignupState.Waitlisted,
        waitlist_position: 1,
        bucket: null,
        user_con_profile: {
          __typename: 'UserConProfile',
          id: '2',
          name_inverted: 'Two, Player',
          gravatar_enabled: false,
          gravatar_url: '',
        },
      },
    ]);

    expect(getByText('One, Player')).toBeTruthy();
    expect(getByText('Two, Player')).toBeTruthy();
    expect(getByText(/#1/)).toBeTruthy();
  });

  it('shows the bucket name suffix only for a bucket with expose_attendees, matched by id', async () => {
    const { getByRole } = await renderRunSignupSummary([
      {
        __typename: 'Signup',
        id: '1',
        state: SignupState.Confirmed,
        waitlist_position: null,
        // key intentionally does not equal the registration policy's stored key, to confirm this
        // is matched by id, not any key-based coincidence.
        bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        user_con_profile: {
          __typename: 'UserConProfile',
          id: '1',
          name_inverted: 'One, Player',
          gravatar_enabled: false,
          gravatar_url: '',
        },
      },
    ]);

    expect(getByRole('row', { name: /One, Player.*Confirmed \(Player\)/ })).toBeTruthy();
  });
});
