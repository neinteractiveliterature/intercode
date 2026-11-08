import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, routeFromModule, userEvent, waitFor, within } from '../testUtils';
import * as eventProposalsAdminTable from '../../../app/javascript/EventProposals/EventProposalsAdminTable';
import {
  EventProposalFormsQueryData,
  EventProposalFormsQueryDocument,
  EventProposalsAdminQueryData,
  EventProposalsAdminQueryDocument,
} from '../../../app/javascript/EventProposals/queries.generated';

// The event proposals admin: a category filter with choices from the query data, a status filter with fixed choices,
// text filters, formatted cells, and a loader that supplies form-item columns.

type Entry = EventProposalsAdminQueryData['convention']['event_proposals_paginated']['entries'][number];

const tabletop = { __typename: 'EventCategory', id: '1', name: 'Tabletop RPG', default_color: null } as const;
const panel = { __typename: 'EventCategory', id: '2', name: 'Panel', default_color: null } as const;

const proposal = (id: string, title: string, overrides: Partial<Entry> = {}): Entry => ({
  __typename: 'EventProposal',
  id,
  title,
  length_seconds: 14400,
  status: 'proposed',
  submitted_at: '2026-06-01T12:00:00Z',
  updated_at: '2026-06-02T12:00:00Z',
  form_response_attrs_json: '{}',
  event_category: tabletop,
  registration_policy: { __typename: 'RegistrationPolicy', minimum_slots: 3, total_slots: 6, slots_limited: true },
  owner: {
    __typename: 'UserConProfile',
    id: `o${id}`,
    name_inverted: 'Anders, Alice',
    gravatar_enabled: false,
    gravatar_url: '',
  },
  ...overrides,
});

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('EventProposalsAdminTable', () => {
  const queried = vi.fn();
  let entries: Entry[];
  let events: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    entries = [
      proposal('1', 'Big Game'),
      proposal('2', 'Quiet Panel', {
        event_category: panel,
        length_seconds: 5400,
        status: 'accepted',
        registration_policy: null,
        owner: {
          __typename: 'UserConProfile',
          id: 'o2',
          name_inverted: 'Brown, Bob',
          gravatar_enabled: false,
          gravatar_url: '',
        },
      }),
    ];
  });

  const renderTable = async (search = '') => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: EventProposalFormsQueryDocument },
        result: {
          data: {
            __typename: 'Query',
            convention: {
              __typename: 'Convention',
              id: '1',
              event_categories: [
                { __typename: 'EventCategory', id: '1', event_proposal_form: null },
                { __typename: 'EventCategory', id: '2', event_proposal_form: null },
              ],
            },
          } satisfies EventProposalFormsQueryData,
        },
        maxUsageCount: 5,
      },
      {
        request: {
          query: EventProposalsAdminQueryDocument,
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
              starts_at: null,
              ends_at: null,
              event_categories: [tabletop, panel],
              event_proposals_paginated: {
                __typename: 'EventProposalsPagination',
                total_entries: entries.length,
                total_pages: 1,
                current_page: 1,
                per_page: 20,
                entries,
              },
            },
          } satisfies EventProposalsAdminQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          ...routeFromModule('/admin_event_proposals', eventProposalsAdminTable),
          Component: () => (
            <>
              <eventProposalsAdminTable.default />
              <LocationProbe />
            </>
          ),
        },
        { path: '/admin_event_proposals/:id', Component: () => <h1>Viewing a proposal</h1> },
      ],
      {
        apolloMocks,
        initialEntries: [`/admin_event_proposals${search}`],
        appRootContextValue: { timezoneName: 'UTC' },
      },
    );
    await r.findByText('Big Game');
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
  const filterCell = (r: Rendered, columnHeader: string) => {
    const index = columnHeaders(r).indexOf(columnHeader);
    return within(r.getAllByRole('row')[1]).getAllByRole('columnheader')[index];
  };
  const labelsIn = (element: HTMLElement) =>
    within(element)
      .getAllByRole('checkbox')
      .map((checkbox) => checkbox.closest('label')?.textContent?.trim());

  describe('what it shows', () => {
    it('shows the default columns', async () => {
      const r = await renderTable();

      expect(columnHeaders(r)).toEqual([
        'Category',
        'Title',
        'Submitted by',
        'Capacity',
        'Duration',
        'Status',
        'Submitted',
        'Updated',
        '',
      ]);
    });

    it('shows each proposal with its category, capacity, duration and status', async () => {
      const r = await renderTable();

      // (leaving out the two timestamp columns, which depend on formatting)
      const withoutTimestamps = (cells: (string | undefined)[]) => [...cells.slice(0, 6), cells[8]];
      expect(withoutTimestamps(cellTexts(rowFor(r, 'Big Game')))).toEqual([
        'Tabletop RPG',
        'Big Game',
        'Anders, Alice',
        '3-6',
        '4:00',
        'Proposed',
        'Open in new window',
      ]);
      expect(withoutTimestamps(cellTexts(rowFor(r, 'Quiet Panel')))).toEqual([
        'Panel',
        'Quiet Panel',
        'Brown, Bob',
        '',
        '1:30',
        'Accepted',
        'Open in new window',
      ]);
    });

    it('asks for the first page of twenty, unfiltered and unsorted', async () => {
      await renderTable();

      expect(lastVariables()).toMatchObject({ page: 1, perPage: 20, filters: {}, sort: [] });
    });

    it('goes to the proposal when a row is clicked', async () => {
      const r = await renderTable();

      await events.click(r.getByText('Quiet Panel'));

      expect(await r.findByRole('heading', { name: 'Viewing a proposal' })).toBeTruthy();
    });

    it('links to the proposal in a new window without going to it in this one', async () => {
      const r = await renderTable();

      const link = within(rowFor(r, 'Big Game')).getByRole('link', { name: 'Open in new window' });
      expect(link.getAttribute('href')).toBe('/admin_event_proposals/1');
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  describe('the category filter', () => {
    it('offers the categories from the query, in order of name', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Category')).getByRole('button', { name: 'Open' }));

      expect(labelsIn(filterCell(r, 'Category'))).toEqual(['Panel', 'Tabletop RPG']);
    });

    it('filters by the categories chosen (asked for by number, once through the URL)', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Category')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Category')).getByRole('checkbox', { name: 'Tabletop RPG' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ event_category: [1] }));
      expect(search(r)).toContain('filters.event_category=1');

      await events.click(within(filterCell(r, 'Category')).getByRole('checkbox', { name: 'Panel' }));
      await waitFor(() => expect(lastVariables().filters).toEqual({ event_category: [1, 2] }));
      expect(search(r)).toContain('filters.event_category=1,2');
    });

    it('takes the categories from the URL', async () => {
      await renderTable('?filters.event_category=1,2');

      expect(lastVariables().filters).toEqual({ event_category: [1, 2] });
    });
  });

  describe('the status filter', () => {
    it('offers every status, in order of label', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Status')).getByRole('button', { name: 'Open' }));

      expect(labelsIn(filterCell(r, 'Status'))).toEqual([
        'Accepted',
        'Proposed',
        'Rejected',
        'Reviewing',
        'Tentative accept',
        'Withdrawn',
      ]);
    });

    it('filters by the statuses chosen', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Status')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Status')).getByRole('checkbox', { name: 'Accepted' }));
      await events.click(within(filterCell(r, 'Status')).getByRole('checkbox', { name: 'Tentative accept' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ status: ['accepted', 'tentative_accept'] }));
      expect(search(r)).toContain('filters.status=accepted,tentative_accept');
    });

    it('takes the statuses from the URL, and shows them as chosen', async () => {
      const r = await renderTable('?filters.status=rejected,withdrawn');

      expect(lastVariables().filters).toEqual({ status: ['rejected', 'withdrawn'] });
      const checked = (name: string) =>
        (within(filterCell(r, 'Status')).getByRole('checkbox', { name }) as HTMLInputElement).checked;
      expect(checked('Rejected')).toBe(true);
      expect(checked('Withdrawn')).toBe(true);
      expect(checked('Accepted')).toBe(false);
    });
  });

  describe('text filters', () => {
    it('filters by title and by who submitted', async () => {
      const r = await renderTable();
      const title = within(filterCell(r, 'Title')).getByRole('textbox');
      await events.click(title);
      await events.type(title, 'Big{Enter}');
      await waitFor(() => expect(lastVariables().filters).toEqual({ title: 'Big' }));

      const owner = within(filterCell(r, 'Submitted by')).getByRole('textbox');
      await events.click(owner);
      await events.type(owner, 'Alice{Enter}');
      await waitFor(() => expect(lastVariables().filters).toEqual({ title: 'Big', owner: 'Alice' }));
    });
  });

  describe('sorting', () => {
    it('sorts a number column that is clicked, largest first to begin with', async () => {
      const r = await renderTable();

      await events.click(within(r.getAllByRole('row')[0]).getByRole('button', { name: /^Duration/ }));

      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'length_seconds', desc: true }]));
    });

    it('sorts a text column that is clicked, A to Z to begin with', async () => {
      const r = await renderTable();

      await events.click(within(r.getAllByRole('row')[0]).getByRole('button', { name: /^Title/ }));

      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'title', desc: false }]));
    });

    it('does not sort by capacity, which has no sorting', async () => {
      const r = await renderTable();

      expect(within(r.getAllByRole('row')[0]).queryByRole('button', { name: /^Capacity/ })).toBeNull();
    });
  });
});
