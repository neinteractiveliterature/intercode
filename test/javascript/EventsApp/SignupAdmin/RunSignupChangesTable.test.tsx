import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../../testUtils';
import RunSignupChangesTable from '../../../../app/javascript/EventsApp/SignupAdmin/RunSignupChangesTable';
import {
  RunSignupChangesPageQueryData,
  RunSignupChangesPageQueryDocument,
  RunSignupChangesQueryData,
  RunSignupChangesQueryDocument,
} from '../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import { SignupChangeAction, SignupState } from '../../../../app/javascript/graphqlTypes.generated';
import { buildRunSignupChange, RunSignupChangeEntry, signupChangeEvent } from '../../fixtures/signupChanges';
import { cellTexts, columnHeaders, filterCell, rowFor } from '../../Tables/tableTestHelpers';
import { AuthenticationManagerContext, buildSignedInManager, stubCsvDownload } from '../../Tables/csvExportTestHelpers';

// The signup history of one run.  It shares its cells, its change filter and its export with SignupSpyTable (see
// Reports/SignupSpyTable.test.tsx) but has no default sort and nothing sortable.

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('RunSignupChangesTable', () => {
  const queried = vi.fn();
  let entries: RunSignupChangeEntry[];
  let events: ReturnType<typeof userEvent.setup>;
  let csv: ReturnType<typeof stubCsvDownload>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    csv = stubCsvDownload({ filename: 'run_signup_changes.csv' });
    entries = [
      buildRunSignupChange('1', 'One, Player', {
        signup: {
          __typename: 'Signup',
          id: 's1',
          requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        },
      }),
      buildRunSignupChange('2', 'Two, Player', {
        state: SignupState.Withdrawn,
        action: SignupChangeAction.Withdraw,
        previous_signup_change: {
          __typename: 'SignupChange',
          id: '20',
          state: SignupState.Confirmed,
          counted: true,
          bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
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
        request: { query: RunSignupChangesPageQueryDocument, variables: { runId: '3' } },
        result: {
          data: {
            __typename: 'Query',
            convention: {
              __typename: 'Convention',
              id: '1',
              timezone_name: 'UTC',
              run: { __typename: 'Run', id: '3', event: signupChangeEvent },
            },
          } satisfies RunSignupChangesPageQueryData,
        },
        maxUsageCount: 5,
      },
      {
        request: {
          query: RunSignupChangesQueryDocument,
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
              run: {
                __typename: 'Run',
                id: '3',
                signup_changes_paginated: {
                  __typename: 'SignupChangesPagination',
                  total_entries: entries.length,
                  total_pages: 1,
                  current_page: 1,
                  per_page: 20,
                  entries,
                },
              },
            },
          } satisfies RunSignupChangesQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          path: '/runs/:runId/history',
          Component: () => (
            <AuthenticationManagerContext.Provider value={buildSignedInManager()}>
              <RunSignupChangesTable />
              <LocationProbe />
            </AuthenticationManagerContext.Provider>
          ),
        },
      ],
      { apolloMocks, initialEntries: [`/runs/3/history${search}`], appRootContextValue: { timezoneName: 'UTC' } },
    );
    await r.findByText('One, Player');
    return r;
  };

  type Rendered = Awaited<ReturnType<typeof renderTable>>;
  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];
  const search = (r: Rendered) => r.getByTestId('search').textContent;

  it('shows each change with its state, its bucket and when it happened', async () => {
    const r = await renderTable();

    expect(columnHeaders(r)).toEqual(['Name', 'Change', 'Bucket', 'Timestamp']);
    const cells = cellTexts(rowFor(r, 'One, Player'));
    expect(cells[0]).toBe('One, Player');
    expect(cells[1]).toBe('Confirmedself-service signup');
    expect(cells[2]).toBe('Player');
    expect(cells[3]).toMatch(/2026/);
  });

  it('shows what a signup changed from', async () => {
    const r = await renderTable();

    expect(cellTexts(rowFor(r, 'Two, Player'))[1]).toBe('Confirmed → Withdrawnwithdraw');
  });

  it('asks for this run’s changes, first page, unfiltered and unsorted', async () => {
    await renderTable();

    expect(lastVariables()).toMatchObject({ runId: '3', page: 1, perPage: 20, filters: {}, sort: [] });
  });

  it('has no sorting', async () => {
    const r = await renderTable();

    expect(within(r.getAllByRole('row')[0]).queryAllByRole('button')).toHaveLength(0);
  });

  it('filters by name', async () => {
    const r = await renderTable();
    const name = within(filterCell(r, 'Name')).getByRole('textbox');

    await events.click(name);
    await events.type(name, 'Two{Enter}');

    await waitFor(() => expect(lastVariables().filters).toEqual({ name: 'Two' }));
    await waitFor(() => expect(search(r)).toContain('filters.name=Two'));
  });

  it('offers a choice of the kinds of change, and filters by those chosen', async () => {
    const r = await renderTable();
    await events.click(within(filterCell(r, 'Change')).getByRole('button', { name: 'Open' }));

    await events.click(within(filterCell(r, 'Change')).getByRole('checkbox', { name: 'withdraw' }));
    await events.click(within(filterCell(r, 'Change')).getByRole('checkbox', { name: 'hold expired' }));

    await waitFor(() => expect(lastVariables().filters).toEqual({ action: ['withdraw', 'hold_expired'] }));
    await waitFor(() => expect(search(r)).toContain('filters.action=withdraw,hold_expired'));
  });

  it('remembers its page size separately from the signup spy report', async () => {
    const r = await renderTable();

    await events.selectOptions(r.getByRole('combobox'), '50');

    await waitFor(() => expect(lastVariables().perPage).toBe(50));
    expect(window.localStorage.getItem('tables:runSignupChanges:pageSize')).toBe('50');
    expect(window.localStorage.getItem('tables:signupSpy:pageSize')).toBeNull();
  });

  it('takes a filter on the kind of change from the URL', async () => {
    await renderTable('?filters.action=withdraw');

    expect(lastVariables().filters).toEqual({ action: ['withdraw'] });
  });

  it('exports the visible columns for this run, with the change and bucket columns split into their parts', async () => {
    const r = await renderTable('?filters.name=One');

    await events.click(r.getByRole('button', { name: /Export CSV/ }));

    await waitFor(() => expect(csv.requestCount()).toBe(1));
    const { url } = csv.lastRequest();
    expect(url.pathname).toBe('/csv_exports/run_signup_changes');
    expect(url.searchParams.get('run_id')).toBe('3');
    expect(url.searchParams.get('filters[name]')).toBe('One');
    expect(url.searchParams.getAll('columns[]')).toEqual([
      'name',
      'action',
      'prev_state',
      'state',
      'prev_bucket',
      'bucket',
      'created_at',
    ]);
    await waitFor(() => expect(csv.downloads).toEqual(['run_signup_changes.csv']));
  });
});
