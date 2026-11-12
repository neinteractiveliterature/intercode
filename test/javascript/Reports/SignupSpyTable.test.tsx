import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import SignupSpyTable from '../../../app/javascript/Reports/SignupSpyTable';
import {
  SignupSpySignupChangesQueryData,
  SignupSpySignupChangesQueryDocument,
} from '../../../app/javascript/Reports/queries.generated';
import { SignupChangeAction, SignupState } from '../../../app/javascript/graphqlTypes.generated';
import { buildSignupSpyChange, SignupSpyChangeEntry } from '../fixtures/signupChanges';
import { cellTexts, columnHeaders, filterCell, rowFor, sortButton } from '../Tables/tableTestHelpers';
import { AuthenticationManagerContext, buildSignedInManager, stubCsvDownload } from '../Tables/csvExportTestHelpers';

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('SignupSpyTable', () => {
  const queried = vi.fn();
  let entries: SignupSpyChangeEntry[];
  let events: ReturnType<typeof userEvent.setup>;
  let csv: ReturnType<typeof stubCsvDownload>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    csv = stubCsvDownload({ filename: 'signup_changes.csv' });
    entries = [
      buildSignupSpyChange('1', 'One, Player'),
      buildSignupSpyChange('2', 'Two, Player', {
        state: SignupState.Waitlisted,
        counted: false,
        action: SignupChangeAction.Withdraw,
        bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        previous_signup_change: {
          __typename: 'SignupChange',
          id: '20',
          state: SignupState.Confirmed,
          counted: true,
          bucket: { __typename: 'RegistrationPolicyBucket', id: '2' },
        },
      }),
    ];
  });

  afterEach(() => {
    csv.restore();
  });

  const renderTable = async (search = '') => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: SignupSpySignupChangesQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => ({
          data: {
            __typename: 'Query',
            convention: {
              __typename: 'Convention',
              id: '1',
              timezone_name: 'UTC',
              signup_changes_paginated: {
                __typename: 'SignupChangesPagination',
                total_entries: entries.length,
                total_pages: 1,
                current_page: 1,
                per_page: 20,
                entries,
              },
            },
          } satisfies SignupSpySignupChangesQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          path: '/reports/signup_spy',
          Component: () => (
            <AuthenticationManagerContext.Provider value={buildSignedInManager()}>
              <SignupSpyTable />
              <LocationProbe />
            </AuthenticationManagerContext.Provider>
          ),
        },
      ],
      { apolloMocks, initialEntries: [`/reports/signup_spy${search}`], appRootContextValue: { timezoneName: 'UTC' } },
    );
    await r.findByText('One, Player');
    return r;
  };

  type Rendered = Awaited<ReturnType<typeof renderTable>>;
  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];
  const search = (r: Rendered) => r.getByTestId('search').textContent;

  describe('what it shows', () => {
    it('shows the default columns', async () => {
      const r = await renderTable();

      expect(columnHeaders(r)).toEqual(['Name', 'Event', 'Change', 'Bucket', 'Timestamp', 'Choice']);
    });

    it('shows a new signup with its state, how it came about, its bucket and its choice', async () => {
      const r = await renderTable();

      const cells = cellTexts(rowFor(r, 'One, Player'));
      expect(cells[0]).toBe('One, Player');
      expect(cells[1]).toBe('Big Game');
      expect(cells[2]).toBe('Confirmedself-service signup');
      expect(cells[3]).toBe('Player (no preference)');
      expect(cells[5]).toBe('1');
    });

    it('shows what a signup changed from, in its state and its bucket', async () => {
      const r = await renderTable();

      const cells = cellTexts(rowFor(r, 'Two, Player'));
      expect(cells[2]).toBe('Confirmed → Waitlistedwithdraw');
      expect(cells[3]).toBe('GM (no preference)Player (not counted)');
    });

    it('says N/C instead of the choice for a signup that does not count', async () => {
      const r = await renderTable();

      expect(cellTexts(rowFor(r, 'Two, Player'))[5]).toBe('N/C');
    });
  });

  describe('the default order', () => {
    it('asks for the newest changes first, and says so in the URL and the Timestamp header', async () => {
      const r = await renderTable();

      expect(lastVariables().sort).toEqual([{ field: 'created_at', desc: true }]);
      await waitFor(() => expect(search(r)).toContain('sort.created_at=desc'));
      expect(sortButton(r, /^Timestamp/).textContent).toContain('▾');
    });

    // Clearing the sort falls back to the default (newest first), so the first click appears to do nothing.
    it('sorts oldest first when the Timestamp header is clicked twice', async () => {
      const r = await renderTable();

      await events.click(sortButton(r, /^Timestamp/));
      await waitFor(() => expect(search(r)).not.toContain('sort.created_at=desc'));
      expect(lastVariables().sort).toEqual([{ field: 'created_at', desc: true }]);

      await events.click(sortButton(r, /^Timestamp/));
      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'created_at', desc: false }]));
      expect(sortButton(r, /^Timestamp/).textContent).toContain('▴');
    });
  });

  describe('filtering', () => {
    it('filters by name and by event', async () => {
      const r = await renderTable();
      const name = within(filterCell(r, 'Name')).getByRole('textbox');
      await events.click(name);
      await events.type(name, 'One{Enter}');
      await waitFor(() => expect(lastVariables().filters).toEqual({ name: 'One' }));

      const event = within(filterCell(r, 'Event')).getByRole('textbox');
      await events.click(event);
      await events.type(event, 'Big{Enter}');
      await waitFor(() => expect(lastVariables().filters).toEqual({ name: 'One', event_title: 'Big' }));
    });

    it('offers a choice of every kind of change, in order of description', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Change')).getByRole('button', { name: 'Open' }));

      const labels = within(filterCell(r, 'Change'))
        .getAllByRole('checkbox')
        .map((checkbox) => checkbox.closest('label')?.textContent?.trim());
      expect(labels).toHaveLength(11);
      expect(labels.slice(0, 3)).toEqual([
        'accepted signup ranked choice',
        'accepted signup request',
        'admin-created signup',
      ]);
      expect(labels).toContain('withdraw');
    });

    it('filters by the kinds of change chosen', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Change')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Change')).getByRole('checkbox', { name: 'withdraw' }));
      await events.click(within(filterCell(r, 'Change')).getByRole('checkbox', { name: 'hold expired' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ action: ['withdraw', 'hold_expired'] }));
      await waitFor(() => expect(search(r)).toContain('filters.action=withdraw,hold_expired'));
    });
  });

  describe('refreshing', () => {
    it('asks again when Refresh is clicked', async () => {
      const r = await renderTable();
      const before = queried.mock.calls.length;

      await events.click(r.getByRole('button', { name: 'Refresh' }));

      await waitFor(() => expect(queried.mock.calls.length).toBeGreaterThan(before));
      // the button is disabled while the refresh is in progress; wait for it to finish
      await waitFor(() =>
        expect((r.getByRole('button', { name: 'Refresh' }) as HTMLButtonElement).disabled).toBe(false),
      );
    });
  });

  describe('exporting', () => {
    it('asks for the visible columns, with the change and bucket columns split into their parts', async () => {
      const r = await renderTable();

      await events.click(r.getByRole('button', { name: /Export CSV/ }));

      await waitFor(() => expect(csv.requestCount()).toBe(1));
      const { url, headers } = csv.lastRequest();
      expect(url.pathname).toBe('/csv_exports/signup_changes');
      expect(url.searchParams.getAll('columns[]')).toEqual([
        'name',
        'event_title',
        'action',
        'prev_state',
        'state',
        'prev_bucket',
        'bucket',
        'created_at',
        'choice',
      ]);
      expect(headers.Authorization).toBe('Bearer test-token');
      await waitFor(() => expect(csv.downloads).toEqual(['signup_changes.csv']));
    });

    it('asks for the same order and filters that are showing', async () => {
      const r = await renderTable('?filters.name=One&filters.action=withdraw&sort.created_at=asc');

      await events.click(r.getByRole('button', { name: /Export CSV/ }));

      await waitFor(() => expect(csv.requestCount()).toBe(1));
      const { url } = csv.lastRequest();
      expect(url.searchParams.get('filters[name]')).toBe('One');
      expect(url.searchParams.getAll('filters[action][]')).toEqual(['withdraw']);
      expect(url.searchParams.getAll('sort[][field]')).toEqual(['created_at']);
      // let the download finish before the stubs are taken away
      await waitFor(() => expect(csv.downloads).toHaveLength(1));
    });
  });
});
