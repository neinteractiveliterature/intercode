import { Outlet, useLocation } from 'react-router';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../../testUtils';
import { default as RunSignupsTable } from '../../../../app/javascript/EventsApp/SignupAdmin/RunSignupsTable';
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
import { NamedRoute } from '../../../../app/javascript/NamedRoute';

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

  describe('filtering and sorting', () => {
    type Entry = RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'][number];

    const buildEntry = (id: string, name: string, state: SignupState): Entry => ({
      __typename: 'Signup',
      id,
      state,
      counted: true,
      age_restrictions_check: 'OK',
      bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
      requested_bucket: null,
      run: { __typename: 'Run', id: '1', starts_at: '2025-01-01T19:00:00Z' },
      user_con_profile: {
        __typename: 'UserConProfile',
        id,
        name_inverted: name,
        name_without_nickname: name,
        gravatar_enabled: false,
        gravatar_url: '',
        email: `player-${id}@example.com`,
        birth_date: '2000-01-01',
      },
    });

    const queried = vi.fn();
    let events: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      queried.mockReset();
      events = userEvent.setup();
    });

    const renderTable = async (search = '') => {
      const eventMock: MockLink.MockedResponse<SignupAdminEventQueryData> = {
        request: { query: SignupAdminEventQueryDocument, variables: { eventId: '1' } },
        result: { data: buildEventLoaderData() },
        maxUsageCount: 10,
      };
      const signupsMock: MockLink.MockedResponse<RunSignupsTableSignupsQueryData> = {
        request: {
          query: RunSignupsTableSignupsQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => ({
          data: buildSignupsQueryData([
            buildEntry('1', 'One, Player', SignupState.Confirmed),
            buildEntry('2', 'Two, Player', SignupState.Waitlisted),
          ]),
        }),
        maxUsageCount: 50,
      };

      const r = await renderRoute(
        [
          {
            path: '/events/:eventId/runs/:runId/admin_signups',
            id: NamedRoute.SignupAdmin,
            loader: signupAdminEventLoader,
            Component: () => (
              <>
                <Outlet />
                <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>
              </>
            ),
            children: [{ index: true, Component: RunSignupsTable }],
          },
        ],
        { apolloMocks: [eventMock, signupsMock], initialEntries: [`/events/1/runs/1/admin_signups${search}`] },
      );
      await waitFor(() => expect(r.getByText('One, Player')).toBeTruthy());
      return r;
    };

    type Rendered = Awaited<ReturnType<typeof renderTable>>;
    const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];
    const search = (r: Rendered) => r.getByTestId('search').textContent;
    // the filter row follows the header row; the visible columns are id, state, name, bucket, age check, email
    const filterCell = (r: Rendered, index: number) =>
      within(r.getAllByRole('row')[1]).getAllByRole('columnheader')[index];
    const stateFilter = (r: Rendered) => filterCell(r, 1);
    const nameFilter = (r: Rendered) => filterCell(r, 2);
    const bucketFilter = (r: Rendered) => filterCell(r, 3);

    it('offers a choice of every state in the state filter, saying any by default', async () => {
      const r = await renderTable();
      expect(within(stateFilter(r)).getByText('Any')).toBeTruthy();

      await events.click(within(stateFilter(r)).getByRole('button', { name: 'Open' }));

      expect(
        within(stateFilter(r))
          .getAllByRole('checkbox')
          .map((c) => c.closest('label')?.textContent?.trim()),
      ).toEqual(['Confirmed', 'Held pending ticket purchase', 'Waitlisted', 'Withdrawn']);
    });

    it('filters by the states that are chosen', async () => {
      const r = await renderTable();
      await events.click(within(stateFilter(r)).getByRole('button', { name: 'Open' }));

      await events.click(within(stateFilter(r)).getByRole('checkbox', { name: 'Waitlisted' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ state: ['waitlisted'] }));
      await waitFor(() => expect(search(r)).toContain('filters.state=waitlisted'));

      await events.click(within(stateFilter(r)).getByRole('checkbox', { name: 'Confirmed' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ state: ['waitlisted', 'confirmed'] }));

      await events.click(within(stateFilter(r)).getByRole('checkbox', { name: 'Waitlisted' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ state: ['confirmed'] }));
    });

    it('selects every state, or none, with the buttons under the choices', async () => {
      const r = await renderTable();
      await events.click(within(stateFilter(r)).getByRole('button', { name: 'Open' }));

      await events.click(within(stateFilter(r)).getByRole('button', { name: 'Select all' }));
      await waitFor(() =>
        expect(lastVariables().filters.state).toEqual(['confirmed', 'ticket_purchase_hold', 'waitlisted', 'withdrawn']),
      );

      await events.click(within(stateFilter(r)).getByRole('button', { name: 'Select none' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({}));
      await waitFor(() => expect(search(r)).not.toContain('filters.state'));
    });

    it('takes the chosen states from the URL, and says what they are', async () => {
      const r = await renderTable('?filters.state=confirmed,waitlisted');

      expect(lastVariables().filters).toEqual({ state: ['confirmed', 'waitlisted'] });
      const checked = (name: string) =>
        (within(stateFilter(r)).getByRole('checkbox', { name }) as HTMLInputElement).checked;
      expect(checked('Confirmed')).toBe(true);
      expect(checked('Waitlisted')).toBe(true);
      expect(checked('Withdrawn')).toBe(false);
      // the caption above the choices, which is all that shows while the choices are closed
      const caption = stateFilter(r).querySelector('.card-header') as HTMLElement;
      expect(caption.textContent).toContain('Confirmed');
      expect(caption.textContent).toContain('Waitlisted');
      expect(caption.textContent).not.toContain('Any');
    });

    it('offers the buckets of the event in the bucket filter, and filters by the id of the one chosen', async () => {
      const r = await renderTable();
      await events.click(within(bucketFilter(r)).getByRole('button', { name: 'Open' }));

      await events.click(within(bucketFilter(r)).getByRole('checkbox', { name: 'Player' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ bucket: ['1'] }));
      await waitFor(() => expect(search(r)).toContain('filters.bucket=1'));
    });

    it('combines a chosen state with a text filter', async () => {
      const r = await renderTable('?filters.state=confirmed');
      const nameInput = within(nameFilter(r)).getByRole('textbox');

      await events.click(nameInput);
      await events.type(nameInput, 'One{Enter}');

      await waitFor(() => expect(lastVariables().filters).toEqual({ state: ['confirmed'], name: 'One' }));
    });

    it('sorts by a column that is clicked', async () => {
      const r = await renderTable();

      await events.click(within(r.getAllByRole('row')[0]).getByRole('button', { name: /^State/ }));

      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'state', desc: false }]));
    });
  });
});
