import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, routeFromModule, userEvent, waitFor, within } from '../../testUtils';
import * as eventTable from '../../../../app/javascript/EventsApp/EventCatalog/EventTable';
import {
  EventCatalogRunsQueryData,
  EventCatalogRunsQueryDocument,
} from '../../../../app/javascript/EventsApp/EventCatalog/EventTable/queries.generated';
import { CommonConventionDataQueryDocument } from '../../../../app/javascript/EventsApp/queries.generated';
import { TimezoneMode } from '../../../../app/javascript/graphqlTypes.generated';
import { buildCatalogCategory, buildCatalogConvention } from '../../fixtures/eventCatalog';

// The table view of the event catalog (the list view is covered by EventList.test.tsx): a category filter with choices
// from the loader's convention data, a title filter, sortable columns, and optional columns chosen in the URL.

type Entry = EventCatalogRunsQueryData['convention']['runs_paginated']['entries'][number];

const run = (id: string, title: string, overrides: Partial<Entry['event']> = {}, runOverrides: Partial<Entry> = {}) =>
  ({
    __typename: 'Run',
    id,
    starts_at: '2026-06-06T18:00:00Z',
    title_suffix: null,
    schedule_note: null,
    rooms: [{ __typename: 'Room', id: `room${id}`, name: `Room ${id}` }],
    event: {
      __typename: 'Event',
      id: `e${id}`,
      title,
      created_at: '2026-01-02T12:00:00Z',
      description_html: '<p>Long description</p>',
      short_blurb_html: '<p>Short blurb</p>',
      form_response_attrs_json_with_rendered_markdown: '{}',
      my_rating: null,
      length_seconds: 3 * 3600,
      author: `Author of ${title}`,
      content_warnings: null,
      participant_communications: null,
      event_category: { __typename: 'EventCategory', id: '4' },
      team_members: [
        {
          __typename: 'TeamMember',
          id: `tm${id}a`,
          display_team_member: true,
          user_con_profile: {
            __typename: 'UserConProfile',
            id: `p${id}a`,
            last_name: 'Anders',
            name_without_nickname: 'Alice Anders',
            gravatar_enabled: false,
            gravatar_url: '',
          },
        },
        {
          __typename: 'TeamMember',
          id: `tm${id}b`,
          display_team_member: false,
          user_con_profile: {
            __typename: 'UserConProfile',
            id: `p${id}b`,
            last_name: 'Hidden',
            name_without_nickname: 'Hidden Helper',
            gravatar_enabled: false,
            gravatar_url: '',
          },
        },
      ],
      registration_policy: { __typename: 'RegistrationPolicy', slots_limited: true, total_slots: 6, minimum_slots: 3 },
      ...overrides,
    },
    ...runOverrides,
  }) as Entry;

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('EventTable (the event catalog, as a table)', () => {
  const queried = vi.fn();
  let entries: Entry[];
  let events: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    entries = [
      run('1', 'Big Game'),
      run('2', 'Quiet Panel', { event_category: { __typename: 'EventCategory', id: '5' }, length_seconds: 5400 }),
    ];
  });

  const renderTable = async (search = '') => {
    const categories = [
      buildCatalogCategory({ id: '4', name: 'Tabletop RPG' }),
      buildCatalogCategory({ id: '5', name: 'Panel' }),
    ];
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: CommonConventionDataQueryDocument },
        result: { data: { __typename: 'Query', convention: buildCatalogConvention(categories) } },
        maxUsageCount: 20,
      },
      {
        request: {
          query: EventCatalogRunsQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => ({
          data: {
            __typename: 'Query',
            currentAbility: { __typename: 'Ability', can_read_schedule: true },
            convention: {
              __typename: 'Convention',
              id: '1',
              timezone_mode: TimezoneMode.ConventionLocal,
              runs_paginated: {
                __typename: 'RunsPagination',
                total_entries: entries.length,
                total_pages: 1,
                current_page: 1,
                per_page: 20,
                entries,
              },
            },
          } satisfies EventCatalogRunsQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          ...routeFromModule('/events/table', eventTable),
          Component: () => (
            <>
              <eventTable.default />
              <LocationProbe />
            </>
          ),
        },
        { path: '/events/:id', Component: () => <h1>Viewing an event</h1> },
      ],
      { apolloMocks, initialEntries: [`/events/table${search}`], appRootContextValue: { timezoneName: 'UTC' } },
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

  describe('what it shows', () => {
    it('shows the default columns', async () => {
      const r = await renderTable();

      expect(columnHeaders(r)).toEqual(['Category', 'Title', 'Starts at', 'Duration', 'Capacity']);
    });

    it('shows each run with its category (from the convention), title, duration and capacity', async () => {
      const r = await renderTable();

      // (leaving out the start time, which depends on formatting)
      const withoutStart = (cells: (string | undefined)[]) => cells.filter((_, index) => index !== 2);
      expect(withoutStart(cellTexts(rowFor(r, 'Big Game')))).toEqual(['Tabletop RPG', 'Big Game', '3:00', '3-6']);
      expect(withoutStart(cellTexts(rowFor(r, 'Quiet Panel')))).toEqual(['Panel', 'Quiet Panel', '1:30', '3-6']);
    });

    it('shows other columns when the URL asks for them', async () => {
      const r = await renderTable('?columns=title,room_names,team_members,author,short_blurb');

      expect(columnHeaders(r)).toEqual(['Title', 'Rooms', 'Short blurb', 'Team members', 'Author(s)']);
      expect(cellTexts(rowFor(r, 'Big Game'))).toEqual([
        'Big Game',
        'Room 1',
        'Short blurb',
        // team members who are not to be displayed are left out
        'Alice Anders',
        'Author of Big Game',
      ]);
    });

    it('asks for the first page, unfiltered and unsorted', async () => {
      await renderTable();

      expect(lastVariables()).toMatchObject({ page: 1, filters: {}, sort: [] });
    });

    it('goes to the event when a row is clicked', async () => {
      const r = await renderTable();

      await events.click(r.getByText('Quiet Panel'));

      expect(await r.findByRole('heading', { name: 'Viewing an event' })).toBeTruthy();
    });
  });

  describe('filtering', () => {
    it('offers the categories from the convention, in order of name', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Category')).getByRole('button', { name: 'Open' }));

      expect(
        within(filterCell(r, 'Category'))
          .getAllByRole('checkbox')
          .map((checkbox) => checkbox.closest('label')?.textContent?.trim()),
      ).toEqual(['Panel', 'Tabletop RPG']);
    });

    it('filters by the categories chosen', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Category')).getByRole('button', { name: 'Open' }));

      await events.click(within(filterCell(r, 'Category')).getByRole('checkbox', { name: 'Panel' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ category: [5] }));
      expect(search(r)).toContain('filters.category=5');
    });

    it('filters by title', async () => {
      const r = await renderTable();
      const title = within(filterCell(r, 'Title')).getByRole('textbox');

      await events.click(title);
      await events.type(title, 'Big{Enter}');

      await waitFor(() => expect(lastVariables().filters).toEqual({ title: 'Big' }));
      expect(search(r)).toContain('filters.title=Big');
    });

    it('offers filters only on the columns that have them', async () => {
      const r = await renderTable();

      // category and title
      expect(within(r.getAllByRole('row')[1]).getAllByRole('textbox')).toHaveLength(1);
      expect(within(r.getAllByRole('row')[1]).getAllByRole('button', { name: 'Open' })).toHaveLength(1);
    });
  });

  describe('sorting', () => {
    it('sorts a column that is clicked, and sorts the other way when it is clicked again', async () => {
      const r = await renderTable();
      const titleHeader = () => within(r.getAllByRole('row')[0]).getByRole('button', { name: /^Title/ });

      await events.click(titleHeader());
      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'title', desc: false }]));

      await events.click(titleHeader());
      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'title', desc: true }]));
    });

    it('can sort by start time', async () => {
      const r = await renderTable();

      await events.click(within(r.getAllByRole('row')[0]).getByRole('button', { name: /^Starts at/ }));

      await waitFor(() => expect(lastVariables().sort).toHaveLength(1));
      expect(lastVariables().sort[0].field).toBe('starts_at');
    });

    it('does not offer sorting by capacity', async () => {
      const r = await renderTable();

      expect(within(r.getAllByRole('row')[0]).queryByRole('button', { name: /^Capacity/ })).toBeNull();
    });
  });
});
