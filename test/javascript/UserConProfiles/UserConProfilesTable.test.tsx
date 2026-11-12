import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import UserConProfilesTable from '../../../app/javascript/UserConProfiles/UserConProfilesTable';
import {
  UserConProfilesTableUserConProfilesQueryData,
  UserConProfilesTableUserConProfilesQueryDocument,
  AttendeesPageQueryData,
} from '../../../app/javascript/UserConProfiles/queries.generated';
import { FormType, TicketMode, TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';

// The attendees table: text filters, a ticket type filter with choices from the page query, boolean filters (which
// wrap the choice-set filter in a different value type) and a privileges filter.

type Entry = NonNullable<
  UserConProfilesTableUserConProfilesQueryData['convention']
>['user_con_profiles_paginated']['entries'][number];

const profile = (id: string, firstName: string, lastName: string, overrides: Partial<Entry> = {}): Entry => ({
  __typename: 'UserConProfile',
  id,
  name_inverted: `${lastName}, ${firstName}`,
  first_name: firstName,
  last_name: lastName,
  email: `${firstName.toLowerCase()}@example.com`,
  site_admin: false,
  form_response_attrs_json: '{}',
  order_summary: '',
  gravatar_enabled: false,
  gravatar_url: '',
  user_id: `u${id}`,
  team_members: [],
  ticket: null,
  ...overrides,
});

const attendeesPageQueryData: AttendeesPageQueryData = {
  __typename: 'Query',
  currentAbility: { __typename: 'Ability', can_read_tickets: true },
  convention: {
    __typename: 'Convention',
    id: '1',
    ticket_name: 'badge',
    ticket_mode: TicketMode.RequiredForSignup,
    timezone_name: 'UTC',
    timezone_mode: TimezoneMode.ConventionLocal,
    ticket_types: [
      { __typename: 'TicketType', id: '10', name: 'attendee' },
      { __typename: 'TicketType', id: '11', name: 'staff' },
    ],
    user_con_profile_form: {
      __typename: 'Form',
      id: '1',
      title: 'Profile form',
      form_type: FormType.UserConProfile,
      form_sections: [],
    },
  },
};

const visibleColumns = ['id', 'name', 'email', 'ticket', 'ticket_type', 'is_team_member', 'attending', 'privileges'];

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('UserConProfilesTable', () => {
  const queried = vi.fn();
  let entries: Entry[];
  let events: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    entries = [
      profile('1', 'Alice', 'Anders', { site_admin: true }),
      profile('2', 'Bob', 'Brown', {
        team_members: [{ __typename: 'TeamMember', id: '5' }],
        ticket: {
          __typename: 'Ticket',
          id: '7',
          updated_at: '2026-06-01T12:00:00Z',
          order_entry: null,
          ticket_type: { __typename: 'TicketType', id: '10', name: 'attendee' },
        },
      }),
    ];
  });

  const renderTable = async (search = '', props: { canReadTickets?: boolean; ticketMode?: TicketMode } = {}) => {
    const { canReadTickets = true, ticketMode } = props;
    const pageData: AttendeesPageQueryData = ticketMode
      ? { ...attendeesPageQueryData, convention: { ...attendeesPageQueryData.convention, ticket_mode: ticketMode } }
      : attendeesPageQueryData;

    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: UserConProfilesTableUserConProfilesQueryDocument,
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
              name: 'Test Con',
              starts_at: null,
              ends_at: null,
              user_con_profiles_paginated: {
                __typename: 'UserConProfilesPagination',
                total_entries: entries.length,
                total_pages: 1,
                current_page: 1,
                per_page: 20,
                entries,
              },
            },
            currentAbility: { __typename: 'Ability', can_create_user_con_profiles: true },
          } satisfies UserConProfilesTableUserConProfilesQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          path: '/user_con_profiles',
          Component: () => (
            <>
              <UserConProfilesTable
                attendeesPageQueryData={pageData}
                canReadTickets={canReadTickets}
                defaultVisibleColumns={visibleColumns}
              />
              <LocationProbe />
            </>
          ),
        },
        { path: '/user_con_profiles/:id', Component: () => <h1>Viewing an attendee</h1> },
      ],
      { apolloMocks, initialEntries: [`/user_con_profiles${search}`] },
    );
    await r.findByText('Anders, Alice');
    return r;
  };

  type Rendered = Awaited<ReturnType<typeof renderTable>>;
  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];
  const search = (r: Rendered) => r.getByTestId('search').textContent;
  const columnHeaders = (r: Rendered) =>
    within(r.getAllByRole('row')[0])
      .getAllByRole('columnheader')
      .map((th) => th.textContent?.replace(/[ ▴▾]/g, '').trim());
  const cellTexts = (row: HTMLElement) =>
    Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim());
  const rowFor = (r: Rendered, text: string) => r.getByText(text).closest('tr') as HTMLElement;
  // the filter row follows the header row
  const filterCell = (r: Rendered, columnHeader: string) => {
    const index = columnHeaders(r).indexOf(columnHeader);
    return within(r.getAllByRole('row')[1]).getAllByRole('columnheader')[index];
  };

  describe('what it shows', () => {
    it('shows the chosen columns', async () => {
      const r = await renderTable();

      expect(columnHeaders(r)).toEqual([
        'ID',
        'Name',
        'Email',
        'Badge',
        'Badge type',
        'Event team member?',
        'Attending?',
        'Privileges',
      ]);
    });

    it('shows each attendee, with tickets, team membership and privileges', async () => {
      const r = await renderTable();

      expect(cellTexts(rowFor(r, 'Anders, Alice'))).toEqual([
        '1',
        'Anders, Alice',
        'alice@example.com',
        'Unpaid',
        'Unpaid',
        'no',
        'no',
        'Global admin',
      ]);
      expect(cellTexts(rowFor(r, 'Brown, Bob'))).toEqual([
        '2',
        'Brown, Bob',
        'bob@example.com',
        expect.stringContaining('Attendee'),
        'Attendee',
        'yes',
        'yes',
        '',
      ]);
    });

    it('asks for the first page of twenty, unfiltered and unsorted', async () => {
      await renderTable();

      expect(lastVariables()).toMatchObject({ page: 1, perPage: 20, filters: {}, sort: [] });
    });

    it('goes to the attendee when a row is clicked', async () => {
      const r = await renderTable();

      await events.click(r.getByText('Brown, Bob'));

      expect(await r.findByRole('heading', { name: 'Viewing an attendee' })).toBeTruthy();
    });

    it('offers to add an attendee, to those who can', async () => {
      const r = await renderTable();

      expect(r.getByRole('link', { name: /Add/ }).getAttribute('href')).toBe('/user_con_profiles/new');
    });
  });

  describe('text filters', () => {
    it('filters by email', async () => {
      const r = await renderTable();
      const input = within(filterCell(r, 'Email')).getByRole('textbox');

      await events.click(input);
      await events.type(input, 'bob{Enter}');

      await waitFor(() => expect(lastVariables().filters).toEqual({ email: 'bob' }));
      await waitFor(() => expect(search(r)).toContain('filters.email=bob'));
    });
  });

  describe('the boolean filters', () => {
    it('offer any, no and yes (in that order, as choices are sorted by label), with any chosen by default', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Attending?')).getByRole('button', { name: 'Open' }));

      const radios = within(filterCell(r, 'Attending?')).getAllByRole('radio') as HTMLInputElement[];
      expect(radios.map((radio) => radio.closest('label')?.textContent?.trim())).toEqual(['any', 'no', 'yes']);
      expect(radios.map((radio) => radio.checked)).toEqual([true, false, false]);
    });

    it('filter for yes, then for no, then for any', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Attending?')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Attending?')).getByRole('radio', { name: 'yes' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ attending: true }));
      await waitFor(() => expect(search(r)).toContain('filters.attending=true'));

      await events.click(within(filterCell(r, 'Attending?')).getByRole('radio', { name: 'no' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ attending: false }));
      await waitFor(() => expect(search(r)).toContain('filters.attending=false'));

      await events.click(within(filterCell(r, 'Attending?')).getByRole('radio', { name: 'any' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({}));
      await waitFor(() => expect(search(r)).not.toContain('filters.attending'));
    });

    it('take their value from the URL, and show it', async () => {
      const r = await renderTable('?filters.is_team_member=true&filters.attending=false');

      expect(lastVariables().filters).toEqual({ is_team_member: true, attending: false });
      const checkedLabel = (columnHeader: string) =>
        (within(filterCell(r, columnHeader)).getAllByRole('radio') as HTMLInputElement[])
          .filter((radio) => radio.checked)
          .map((radio) => radio.closest('label')?.textContent?.trim());
      expect(checkedLabel('Event team member?')).toEqual(['yes']);
      expect(checkedLabel('Attending?')).toEqual(['no']);
      expect(filterCell(r, 'Attending?').querySelector('.card-header')?.textContent).toContain('no');
    });

    it('work on each column independently', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Attending?')).getByRole('button', { name: 'Open' }));
      await events.click(within(filterCell(r, 'Event team member?')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Attending?')).getByRole('radio', { name: 'yes' }));
      await events.click(within(filterCell(r, 'Event team member?')).getByRole('radio', { name: 'no' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ attending: true, is_team_member: false }));
    });
  });

  describe('the ticket type filter', () => {
    it('offers unpaid and each ticket type', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Badge type')).getByRole('button', { name: 'Open' }));

      expect(
        within(filterCell(r, 'Badge type'))
          .getAllByRole('checkbox')
          .map((checkbox) => checkbox.closest('label')?.textContent?.trim()),
      ).toEqual(['Attendee', 'Staff', 'Unpaid']);
    });

    it('filters by the ticket types chosen, using unpaid as none', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Badge type')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Badge type')).getByRole('checkbox', { name: 'Staff' }));
      await events.click(within(filterCell(r, 'Badge type')).getByRole('checkbox', { name: 'Unpaid' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ ticket_type: ['11', 'none'] }));
      await waitFor(() => expect(search(r)).toContain('filters.ticket_type=11,none'));
    });
  });

  describe('the privileges filter', () => {
    it('filters by site admin', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Privileges')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Privileges')).getByRole('checkbox', { name: 'Global admin' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ privileges: ['site_admin'] }));
    });
  });

  describe('when the person cannot read tickets', () => {
    it('leaves out the ticket and attending columns', async () => {
      const r = await renderTable('', { canReadTickets: false });

      expect(columnHeaders(r)).toEqual(['ID', 'Name', 'Email', 'Event team member?', 'Privileges']);
    });
  });

  describe('when tickets are disabled', () => {
    it('leaves out the ticket columns', async () => {
      const r = await renderTable('', { ticketMode: TicketMode.Disabled });

      expect(columnHeaders(r)).toEqual(['ID', 'Name', 'Email', 'Event team member?', 'Attending?', 'Privileges']);
    });
  });
});
