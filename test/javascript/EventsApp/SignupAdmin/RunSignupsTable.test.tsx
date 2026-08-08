import { Outlet } from 'react-router';
import { MockLink } from '@apollo/client/testing';

import { renderRoute, waitFor } from '../../testUtils';
import { Component as RunSignupsTable } from '../../../../app/javascript/EventsApp/SignupAdmin/RunSignupsTable';
import { signupAdminEventLoader } from '../../../../app/javascript/EventsApp/SignupAdmin/loaders';
import {
  SignupAdminEventQueryData,
  SignupAdminEventQueryDocument,
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryDocument,
} from '../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import {
  SignupAutomationMode,
  SignupMode,
  SignupState,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../../app/javascript/graphqlTypes.generated';
import { NamedRoute } from '../../../../app/javascript/AppRouter';

describe('RunSignupsTable', () => {
  beforeEach(() => {
    // useLocalStorageReactTable persists pageSize across tests in the same file otherwise, making
    // the default per_page variable non-deterministic.
    window.localStorage.clear();
  });

  const buildEventLoaderData = (): SignupAdminEventQueryData => ({
    __typename: 'Query',
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
      event: { __typename: 'Event', id: '1', title: 'Test Event' },
    },
  });

  const buildSignupsQueryData = (
    entries: RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'],
  ): RunSignupsTableSignupsQueryData => ({
    __typename: 'Query',
    convention: {
      __typename: 'Convention',
      id: '1',
      name: 'Test Convention',
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        event_category: { __typename: 'EventCategory', id: '1', team_member_name: 'GM', teamMemberNamePlural: 'GMs' },
        team_members: [],
        registration_policy: {
          __typename: 'RegistrationPolicy',
          buckets: [{ __typename: 'RegistrationPolicyBucket', id: '1', key: 'player', name: 'Player' }],
        },
        run: {
          __typename: 'Run',
          id: '1',
          signups_paginated: {
            __typename: 'SignupsPagination',
            total_entries: entries.length,
            total_pages: 1,
            current_page: 1,
            per_page: 20,
            entries,
          },
        },
      },
    },
  });

  it("shows a signup's bucket name, matched by id, in the default (unsorted, unfiltered) view", async () => {
    const eventMock: MockLink.MockedResponse<SignupAdminEventQueryData> = {
      request: { query: SignupAdminEventQueryDocument, variables: { eventId: '1' } },
      result: { data: buildEventLoaderData() },
    };
    const signupsMock: MockLink.MockedResponse<RunSignupsTableSignupsQueryData> = {
      request: {
        query: RunSignupsTableSignupsQueryDocument,
        variables: { eventId: '1', runId: '1', page: 1, perPage: 20, filters: {}, sort: [] },
      },
      result: {
        data: buildSignupsQueryData([
          {
            __typename: 'Signup',
            id: '1',
            state: SignupState.Confirmed,
            counted: true,
            age_restrictions_check: 'OK',
            // key intentionally does not match the registration policy's stored key, to confirm
            // this is matched by id, not any key-based coincidence.
            bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
            requested_bucket: null,
            run: { __typename: 'Run', id: '1', starts_at: '2025-01-01T19:00:00Z' },
            user_con_profile: {
              __typename: 'UserConProfile',
              id: '1',
              name_inverted: 'One, Player',
              name_without_nickname: 'Player One',
              gravatar_enabled: false,
              gravatar_url: '',
              email: 'player-one@example.com',
              birth_date: '2000-01-01',
            },
          },
        ]),
      },
    };

    const result = await renderRoute(
      [
        {
          path: '/events/:eventId/runs/:runId/admin_signups',
          id: NamedRoute.SignupAdmin,
          loader: signupAdminEventLoader,
          Component: () => <Outlet />,
          children: [{ index: true, Component: RunSignupsTable }],
        },
      ],
      { apolloMocks: [eventMock, signupsMock], initialEntries: ['/events/1/runs/1/admin_signups'] },
    );

    await waitFor(() => expect(result.getByText('One, Player')).toBeTruthy());
    expect(result.getByRole('row', { name: /One, Player.*Player/ })).toBeTruthy();
  });
});
