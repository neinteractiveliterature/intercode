import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import { AuthenticationManagerContext, buildSignedInManager, stubCsvDownload } from '../Tables/csvExportTestHelpers';
import UsersTable from '../../../app/javascript/Users/UsersTable';
import {
  UsersTableUsersQueryData,
  UsersTableUsersQueryDocument,
} from '../../../app/javascript/Users/queries.generated';

// UsersTable is the simplest page built on the shared table machinery (useReactTableWithTheWorks and
// ReactTableWithTheWorks): sortable, text-filterable columns, a column selector, row selection, and paging that is
// kept in the URL and handled by the server.  These tests describe what a user sees and which query variables go to
// the server, not how the table library is used, so they should survive a change of table library.

type UserEntry = UsersTableUsersQueryData['users_paginated']['entries'][number];

const user = (id: string, firstName: string, lastName: string): UserEntry => ({
  __typename: 'User',
  id,
  name_inverted: `${lastName}, ${firstName}`,
  first_name: firstName,
  last_name: lastName,
  email: `${firstName.toLowerCase()}@example.com`,
  privileges: [],
});

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="search">{decodeURIComponent(location.search)}</output>;
}

function UsersTableWithProbe() {
  return (
    <AuthenticationManagerContext.Provider value={buildSignedInManager()}>
      <UsersTable />
      <LocationProbe />
    </AuthenticationManagerContext.Provider>
  );
}

describe('UsersTable', () => {
  const queried = vi.fn();
  let entries: UserEntry[];
  let totalPages: number;
  let events: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    totalPages = 3;
    entries = [user('1', 'Alice', 'Anders'), user('2', 'Bob', 'Brown'), user('3', 'Cara', 'Clark')];
  });

  const renderPage = async (path = '/users') => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: UsersTableUsersQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => ({
          data: {
            __typename: 'Query',
            users_paginated: {
              __typename: 'UsersPagination',
              total_entries: entries.length,
              total_pages: totalPages,
              current_page: 1,
              per_page: 20,
              entries,
            },
            currentAbility: { __typename: 'Ability', can_create_user_con_profiles: true },
          } satisfies UsersTableUsersQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        { path: '/users', Component: UsersTableWithProbe },
        { path: '/users/:id', Component: () => <h1>Viewing a user</h1> },
        { path: '/users/merge/:ids', Component: () => <h1>Merging users</h1> },
      ],
      { apolloMocks, initialEntries: [path] },
    );
    // the row-select column is always visible, so this waits for the rows whichever columns are showing
    await r.findAllByRole('checkbox', { name: 'Select row' });
    return r;
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];
  const search = (r: Awaited<ReturnType<typeof renderPage>>) => r.getByTestId('search').textContent;
  const headerRow = (r: Awaited<ReturnType<typeof renderPage>>) => r.getAllByRole('row')[0];
  const bodyRows = (r: Awaited<ReturnType<typeof renderPage>>) =>
    r.getAllByRole('row').filter((row) => row.closest('tbody') != null);
  const cellTexts = (row: HTMLElement) => Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent);
  const columnHeaders = (r: Awaited<ReturnType<typeof renderPage>>) =>
    within(headerRow(r))
      .getAllByRole('columnheader')
      .map((th) => th.textContent?.replace(/[ ▴▾]/g, '').trim());

  describe('what it shows', () => {
    it('shows a row for each user, with the default columns', async () => {
      const r = await renderPage();

      expect(columnHeaders(r)).toEqual(['', 'ID', 'First name', 'Last name', 'Email']);
      const [aliceRow, bobRow] = bodyRows(r);
      expect(cellTexts(aliceRow).slice(1)).toEqual(['1', 'Alice', 'Anders', 'alice@example.com']);
      expect(cellTexts(bobRow).slice(1)).toEqual(['2', 'Bob', 'Brown', 'bob@example.com']);
    });

    it('links email addresses', async () => {
      const r = await renderPage();

      expect(r.getByRole('link', { name: 'alice@example.com' }).getAttribute('href')).toBe('mailto:alice@example.com');
    });

    it('asks for the first page of twenty, unfiltered and unsorted, by default', async () => {
      await renderPage();

      expect(lastVariables()).toMatchObject({ page: 1, perPage: 20, filters: {}, sort: [] });
    });

    it('goes to the user when a row is clicked', async () => {
      const r = await renderPage();

      await events.click(r.getByText('Bob'));

      expect(await r.findByRole('heading', { name: 'Viewing a user' })).toBeTruthy();
    });
  });

  describe('sorting', () => {
    it('only offers sorting on the sortable columns', async () => {
      const r = await renderPage();

      const sortable = within(headerRow(r))
        .getAllByRole('button')
        .map((button) => button.textContent?.trim());
      expect(sortable).toEqual(['ID', 'First name', 'Last name', 'Email']);
    });

    it('sorts ascending, then descending, then not at all, as a column header is clicked', async () => {
      const r = await renderPage();
      const lastNameHeader = () => within(headerRow(r)).getByRole('button', { name: /Last name/ });

      await events.click(lastNameHeader());
      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'last_name', desc: false }]));
      await waitFor(() => expect(search(r)).toContain('sort.last_name=asc'));
      expect(lastNameHeader().textContent).toContain('▴');

      await events.click(lastNameHeader());
      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'last_name', desc: true }]));
      await waitFor(() => expect(search(r)).toContain('sort.last_name=desc'));
      expect(lastNameHeader().textContent).toContain('▾');

      await events.click(lastNameHeader());
      await waitFor(() => expect(lastVariables().sort).toEqual([]));
      await waitFor(() => expect(search(r)).not.toContain('sort.'));
      expect(lastNameHeader().textContent).not.toMatch(/[▴▾]/);
    });

    it('takes the sort order from the URL', async () => {
      const r = await renderPage('/users?sort.email=desc');

      expect(lastVariables().sort).toEqual([{ field: 'email', desc: true }]);
      expect(within(headerRow(r)).getByRole('button', { name: /Email/ }).textContent).toContain('▾');
    });
  });

  describe('filtering', () => {
    // the filter row comes right after the header row; ID has no filter, so these are first name, last name, email
    const filterInputs = (r: Awaited<ReturnType<typeof renderPage>>) =>
      within(r.getAllByRole('row')[1]).getAllByRole('textbox');

    it('offers a text filter on the filterable columns', async () => {
      const r = await renderPage();

      expect(filterInputs(r)).toHaveLength(3);
    });

    it('filters by what is typed, once it is committed', async () => {
      const r = await renderPage();
      const [firstName] = filterInputs(r);

      await events.click(firstName);
      await events.type(firstName, 'Al');
      // nothing is asked for until the filter is committed
      expect(lastVariables().filters).toEqual({});

      await events.keyboard('{Enter}');

      await waitFor(() => expect(lastVariables().filters).toEqual({ first_name: 'Al' }));
      await waitFor(() => expect(search(r)).toContain('filters.first_name=Al'));
    });

    it('combines filters on different columns', async () => {
      const r = await renderPage('/users?filters.first_name=Al');
      const [, lastName] = filterInputs(r);

      await events.click(lastName);
      await events.type(lastName, 'And{Enter}');

      await waitFor(() => expect(lastVariables().filters).toEqual({ first_name: 'Al', last_name: 'And' }));
    });

    it('takes filters from the URL, and shows them in the filter boxes', async () => {
      const r = await renderPage('/users?filters.email=bob&filters.last_name=Brown');

      expect(lastVariables().filters).toEqual({ email: 'bob', last_name: 'Brown' });
      const [firstName, lastName, email] = filterInputs(r);
      expect((firstName as HTMLInputElement).value).toBe('');
      expect((lastName as HTMLInputElement).value).toBe('Brown');
      expect((email as HTMLInputElement).value).toBe('bob');
    });

    it('clears a filter with its clear button', async () => {
      const r = await renderPage('/users?filters.first_name=Al');

      await events.click(within(r.getAllByRole('row')[1]).getByRole('button', { name: 'Clear' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({}));
      await waitFor(() => expect(search(r)).not.toContain('filters.'));
    });
  });

  describe('paging', () => {
    it('says which page it is on, and how many there are', async () => {
      const r = await renderPage();

      expect((r.getByRole('spinbutton', { name: 'Page' }) as HTMLInputElement).value).toBe('1');
      expect(r.getByText(/of 3/)).toBeTruthy();
    });

    it('cannot go back from the first page, or on from the last', async () => {
      const first = await renderPage();
      expect((first.getByRole('button', { name: /Previous/ }) as HTMLButtonElement).disabled).toBe(true);
      expect((first.getByRole('button', { name: /Next/ }) as HTMLButtonElement).disabled).toBe(false);
      first.unmount();

      const last = await renderPage('/users?page=3');
      expect((last.getByRole('button', { name: /Previous/ }) as HTMLButtonElement).disabled).toBe(false);
      expect((last.getByRole('button', { name: /Next/ }) as HTMLButtonElement).disabled).toBe(true);
    });

    it('goes to the next and previous pages', async () => {
      const r = await renderPage();

      await events.click(r.getByRole('button', { name: /Next/ }));
      await waitFor(() => expect(lastVariables().page).toBe(2));
      await waitFor(() => expect(search(r)).toContain('page=2'));
      expect((r.getByRole('spinbutton', { name: 'Page' }) as HTMLInputElement).value).toBe('2');

      await events.click(r.getByRole('button', { name: /Previous/ }));
      await waitFor(() => expect(lastVariables().page).toBe(1));
      expect((r.getByRole('spinbutton', { name: 'Page' }) as HTMLInputElement).value).toBe('1');
    });

    it('goes to a page that is typed in', async () => {
      const r = await renderPage();
      const pageInput = r.getByRole('spinbutton', { name: 'Page' });

      await events.clear(pageInput);
      await events.type(pageInput, '3');

      await waitFor(() => expect(lastVariables().page).toBe(3));
      await waitFor(() => expect(search(r)).toContain('page=3'));
    });

    it('starts on the page in the URL', async () => {
      const r = await renderPage('/users?page=2');

      expect(lastVariables().page).toBe(2);
      expect((r.getByRole('spinbutton', { name: 'Page' }) as HTMLInputElement).value).toBe('2');
    });

    it('changes the page size, and remembers it', async () => {
      const r = await renderPage();

      await events.selectOptions(r.getByRole('combobox'), '50');

      await waitFor(() => expect(lastVariables().perPage).toBe(50));
      expect(window.localStorage.getItem('tables:users:pageSize')).toBe('50');

      r.unmount();
      await renderPage();
      expect(lastVariables().perPage).toBe(50);
    });
  });

  describe('choosing columns', () => {
    const openColumnSelector = async (r: Awaited<ReturnType<typeof renderPage>>) => {
      await events.click(r.getByRole('button', { name: /Columns/ }));
    };

    it('offers every column but the always-visible one, with the visible ones checked', async () => {
      const r = await renderPage();
      await openColumnSelector(r);

      const checked = (name: string) => (r.getByRole('checkbox', { name }) as HTMLInputElement).checked;
      expect(checked('ID')).toBe(true);
      expect(checked('First name')).toBe(true);
      expect(checked('Last name')).toBe(true);
      expect(checked('Email')).toBe(true);
      expect(checked('Name')).toBe(false);
    });

    it('shows a column that is checked, and keeps that in the URL', async () => {
      const r = await renderPage();
      await openColumnSelector(r);

      await events.click(r.getByRole('checkbox', { name: 'Name' }));

      await waitFor(() => expect(columnHeaders(r)).toContain('Name'));
      await waitFor(() => expect(search(r)).toMatch(/columns=.*name/));
      expect(cellTexts(bodyRows(r)[0])).toContain('Anders, Alice');
    });

    it('hides a column that is unchecked', async () => {
      const r = await renderPage();
      await openColumnSelector(r);

      await events.click(r.getByRole('checkbox', { name: 'Email' }));

      await waitFor(() => expect(columnHeaders(r)).not.toContain('Email'));
      expect(columnHeaders(r)).toEqual(['', 'ID', 'First name', 'Last name']);
      expect(r.queryByText('alice@example.com')).toBeNull();
    });

    it('takes the visible columns from the URL', async () => {
      const r = await renderPage('/users?columns=email,name');

      expect(columnHeaders(r)).toEqual(['', 'Name', 'Email']);
    });
  });

  describe('selecting rows', () => {
    const rowCheckboxes = (r: Awaited<ReturnType<typeof renderPage>>) =>
      r.getAllByRole('checkbox', { name: 'Select row' }) as HTMLInputElement[];
    const selectAll = (r: Awaited<ReturnType<typeof renderPage>>) =>
      r.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;

    it('starts with nothing selected', async () => {
      const r = await renderPage();

      expect(rowCheckboxes(r)).toHaveLength(3);
      expect(rowCheckboxes(r).every((checkbox) => !checkbox.checked)).toBe(true);
      expect(selectAll(r).checked).toBe(false);
      expect(selectAll(r).indeterminate).toBe(false);
    });

    it('selects a row without opening the user', async () => {
      const r = await renderPage();

      await events.click(rowCheckboxes(r)[1]);

      expect(rowCheckboxes(r).map((checkbox) => checkbox.checked)).toEqual([false, true, false]);
      expect(r.queryByRole('heading', { name: 'Viewing a user' })).toBeNull();
    });

    it('shows the select-all box as indeterminate when only some rows are selected', async () => {
      const r = await renderPage();

      await events.click(rowCheckboxes(r)[0]);

      expect(selectAll(r).checked).toBe(false);
      expect(selectAll(r).indeterminate).toBe(true);
    });

    it('selects every row with the select-all box', async () => {
      const r = await renderPage();

      await events.click(selectAll(r));

      expect(rowCheckboxes(r).every((checkbox) => checkbox.checked)).toBe(true);
    });

    it('shows the select-all box as checked, and not indeterminate, once every row is selected one by one', async () => {
      const r = await renderPage();

      for (const checkbox of rowCheckboxes(r)) {
        await events.click(checkbox);
      }

      expect(selectAll(r).checked).toBe(true);
      expect(selectAll(r).indeterminate).toBe(false);
    });

    it('clears the selection with the select-all box when everything is selected', async () => {
      const r = await renderPage();
      await events.click(selectAll(r));

      await events.click(selectAll(r));

      expect(rowCheckboxes(r).every((checkbox) => !checkbox.checked)).toBe(true);
    });

    it('can merge users only once two are selected', async () => {
      const r = await renderPage();
      await events.click(r.getByRole('button', { name: 'Actions' }));
      const merge = () => r.getByRole('button', { name: 'Merge users' }) as HTMLButtonElement;
      expect(merge().disabled).toBe(true);

      await events.click(rowCheckboxes(r)[0]);
      expect(merge().disabled).toBe(true);

      await events.click(rowCheckboxes(r)[2]);
      expect(merge().disabled).toBe(false);

      await events.click(merge());
      expect(await r.findByRole('heading', { name: 'Merging users' })).toBeTruthy();
    });
  });

  describe('exporting', () => {
    let csv: ReturnType<typeof stubCsvDownload>;

    beforeEach(() => {
      csv = stubCsvDownload({ filename: 'users.csv' });
    });

    afterEach(() => {
      csv.restore();
    });

    it('asks for the visible columns, in the order they are shown, and saves the file', async () => {
      const r = await renderPage();

      await events.click(r.getByRole('button', { name: /Export CSV/ }));

      await waitFor(() => expect(csv.requestCount()).toBe(1));
      const { url, headers } = csv.lastRequest();
      expect(url.pathname).toBe('/csv_exports/users');
      expect(url.searchParams.getAll('columns[]')).toEqual(
        expect.arrayContaining(['id', 'first_name', 'last_name', 'email']),
      );
      expect(url.searchParams.getAll('columns[]')).not.toContain('name');
      expect(headers.Authorization).toBe('Bearer test-token');
      await waitFor(() => expect(csv.downloads).toEqual(['users.csv']));
    });

    it('asks for the columns, filters and order that are showing', async () => {
      const r = await renderPage('/users?columns=email,name&filters.email=bob&sort.last_name=desc');

      await events.click(r.getByRole('button', { name: /Export CSV/ }));

      await waitFor(() => expect(csv.requestCount()).toBe(1));
      const { url } = csv.lastRequest();
      expect(url.searchParams.getAll('columns[]')).toEqual(expect.arrayContaining(['email', 'name']));
      expect(url.searchParams.getAll('columns[]')).not.toContain('first_name');
      expect(url.searchParams.get('filters[email]')).toBe('bob');
      expect(url.searchParams.getAll('sort[][field]')).toEqual(['last_name']);
      expect(url.searchParams.getAll('sort[][desc]')).toEqual(['true']);
      await waitFor(() => expect(csv.downloads).toHaveLength(1));
    });

    it('says so when the export fails', async () => {
      csv.restore();
      csv = stubCsvDownload({ ok: false, status: 500 });
      const r = await renderPage();

      await events.click(r.getByRole('button', { name: /Export CSV/ }));

      expect(await r.findByText(/Export failed: HTTP 500/)).toBeTruthy();
      expect(csv.downloads).toEqual([]);
    });
  });
});
