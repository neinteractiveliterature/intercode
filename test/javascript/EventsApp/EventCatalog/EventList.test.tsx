import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../../testUtils';
import { Component as EventList, loader } from '../../../../app/javascript/EventsApp/EventCatalog/EventList';
import { EventListEventsQueryDocument } from '../../../../app/javascript/EventsApp/EventCatalog/EventList/queries.generated';
import { CommonConventionDataQueryDocument } from '../../../../app/javascript/EventsApp/queries.generated';
import { buildMultipleChoiceItem } from '../../fixtures/formItems';
import {
  buildCatalogCategory,
  buildCatalogConvention,
  buildCatalogEvent,
  buildCatalogFormItem,
  buildCatalogRun,
  buildEventListData,
  CatalogEventEntry,
} from '../../fixtures/eventCatalog';

describe('EventList (the event catalog)', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const queried = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    queried.mockReset();
  });

  const tabletop = () => buildCatalogCategory({ id: '4', name: 'Tabletop RPG' });
  const larp = () => buildCatalogCategory({ id: '5', name: 'Larp' });

  const renderPage = ({
    entries = [buildCatalogEvent({ id: '1', title: 'Alpha' })],
    path = '/events',
    myProfile = false,
    canReadSchedule = true,
    categories = [tabletop(), larp()],
    listResult,
  }: {
    entries?: CatalogEventEntry[];
    path?: string;
    myProfile?: boolean;
    canReadSchedule?: boolean;
    categories?: ReturnType<typeof buildCatalogCategory>[];
    listResult?: MockLink.MockedResponse['result'];
  } = {}) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: CommonConventionDataQueryDocument },
        result: { data: { __typename: 'Query', convention: buildCatalogConvention(categories) } },
        maxUsageCount: 20,
      },
      {
        request: {
          query: EventListEventsQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: listResult ?? { data: buildEventListData(entries, { canReadSchedule }) },
        maxUsageCount: 50,
      },
    ];
    return renderRoute(
      [
        { path: '/events', loader, Component: EventList },
        { path: '/events/:id', Component: () => <div>Event page</div> },
      ],
      {
        apolloMocks,
        initialEntries: [path],
        appRootContextValue: {
          timezoneName: 'UTC',
          ...(myProfile ? { myProfile: { __typename: 'UserConProfile', id: '2', name: 'Me' } as never } : {}),
        },
      },
    );
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];

  it('lists the events with a heading and tabs for the list and table views', async () => {
    const r = await renderPage({
      entries: [buildCatalogEvent({ id: '1', title: 'Alpha' }), buildCatalogEvent({ id: '2', title: 'Beta' })],
    });

    expect(await r.findByRole('link', { name: 'Alpha' })).toBeTruthy();
    expect(r.getByRole('link', { name: 'Beta' })).toBeTruthy();
    expect(r.getByRole('heading', { level: 1, name: 'Event Catalog' })).toBeTruthy();
    expect(r.getByRole('link', { name: 'Table view' }).getAttribute('href')).toBe('/events/table');
  });

  describe('what it asks for by default', () => {
    it('sorts by title with every category, for a visitor', async () => {
      const r = await renderPage();
      await r.findByRole('link', { name: 'Alpha' });

      expect(lastVariables()).toMatchObject({
        page: 1,
        pageSize: 20,
        sort: [{ field: 'title', desc: false }],
        filters: { category: [] },
      });
    });

    it('puts favorites first for someone with a profile, showing liked and unrated events', async () => {
      const r = await renderPage({ myProfile: true });
      await r.findByRole('link', { name: 'Alpha' });

      expect(lastVariables()).toMatchObject({
        sort: [
          { field: 'my_rating', desc: true },
          { field: 'title', desc: false },
        ],
        filters: { my_rating: [1, 0], category: [] },
      });
    });

    it('offers the rating filter only to people with a profile', async () => {
      const visitor = await renderPage();
      await visitor.findByRole('link', { name: 'Alpha' });
      expect(visitor.queryByText('Show:')).toBeNull();
      visitor.unmount();

      const member = await renderPage({ myProfile: true });
      expect(await member.findByText('Show:')).toBeTruthy();
    });
  });

  describe('the URL', () => {
    it('sets the sort order', async () => {
      const r = await renderPage({ path: '/events?sort.created_at=desc' });
      await r.findByRole('link', { name: 'Alpha' });

      expect(lastVariables().sort).toEqual([{ field: 'created_at', desc: true }]);
    });

    it('sets filters, decoding the lists', async () => {
      const r = await renderPage({ path: '/events?filters.category=4,5&filters.text_search=dragon' });
      await r.findByRole('link', { name: 'Alpha' });

      expect(lastVariables().filters).toMatchObject({ category: [4, 5], text_search: 'dragon' });
    });
  });

  describe('searching', () => {
    it('asks again with the text typed, and keeps it in the URL', async () => {
      const r = await renderPage();
      await r.findByRole('link', { name: 'Alpha' });

      await user.type(r.getByLabelText('Search'), 'dragon');

      await waitFor(() => expect(lastVariables().filters).toMatchObject({ text_search: 'dragon' }));
    });
  });

  describe('sorting', () => {
    it('offers convention order only to people who can read the schedule', async () => {
      const allowed = await renderPage();
      await allowed.findByRole('link', { name: 'Alpha' });
      await user.click(allowed.getByRole('button', { name: /Sort by/ }));
      expect(await allowed.findByRole('button', { name: 'Convention order' })).toBeTruthy();
      allowed.unmount();

      const denied = await renderPage({ canReadSchedule: false });
      await denied.findByRole('link', { name: 'Alpha' });
      await user.click(denied.getByRole('button', { name: /Sort by/ }));
      expect(await denied.findByRole('button', { name: 'Order added (newest first)' })).toBeTruthy();
      expect(denied.queryByRole('button', { name: 'Convention order' })).toBeNull();
    });

    it('asks again in the chosen order', async () => {
      const r = await renderPage();
      await r.findByRole('link', { name: 'Alpha' });

      await user.click(r.getByRole('button', { name: /Sort by/ }));
      await user.click(await r.findByRole('button', { name: 'Order added (newest first)' }));

      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'created_at', desc: true }]));
    });
  });

  describe('convention order', () => {
    it('puts a heading for each day above its first event', async () => {
      const r = await renderPage({
        path: '/events?sort.first_scheduled_run_start=asc',
        entries: [
          buildCatalogEvent({ id: '1', title: 'Alpha', runs: [buildCatalogRun('r1', '2026-06-05T14:00:00Z')] }),
          buildCatalogEvent({ id: '2', title: 'Beta', runs: [buildCatalogRun('r2', '2026-06-06T14:00:00Z')] }),
        ],
      });

      await r.findByRole('link', { name: 'Alpha' });
      expect(r.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
        expect.stringMatching(/Friday/),
        expect.stringMatching(/Saturday/),
      ]);
    });
  });

  describe('categories', () => {
    it('describes the selection, all event types by default', async () => {
      const r = await renderPage();

      expect(await r.findByRole('button', { name: 'All event types' })).toBeTruthy();
    });

    it('names a single selected category', async () => {
      const r = await renderPage({ path: '/events?filters.category=5' });

      expect(await r.findByRole('button', { name: 'Larp events' })).toBeTruthy();
    });

    it('asks again for just the categories chosen', async () => {
      const r = await renderPage();
      await user.click(await r.findByRole('button', { name: 'All event types' }));

      await user.click(await r.findByRole('checkbox', { name: 'Larp' }));

      await waitFor(() => expect(lastVariables().filters.category).toEqual([4]));
    });
  });

  describe('filterable form items', () => {
    const system = buildMultipleChoiceItem({
      identifier: 'system',
      caption: 'System',
      choices: [
        { caption: 'D&D', value: 'dnd' },
        { caption: 'Fate', value: 'fate' },
      ],
    });

    it('gets a dropdown, and its identifier is fetched with the events', async () => {
      const r = await renderPage({
        categories: [buildCatalogCategory({ id: '4' }, [buildCatalogFormItem(system, 'Game system')])],
      });

      expect(await r.findByRole('button', { name: 'Game system' })).toBeTruthy();
      expect(lastVariables().fetchFormItemIdentifiers).toEqual(['system']);
    });

    it('is left out for items that are not exposed in the catalog', async () => {
      const r = await renderPage({
        categories: [buildCatalogCategory({ id: '4' }, [buildCatalogFormItem(system, 'Game system', false)])],
      });
      await r.findByRole('link', { name: 'Alpha' });

      expect(r.queryByRole('button', { name: 'Game system' })).toBeNull();
      expect(lastVariables().fetchFormItemIdentifiers).toEqual([]);
    });
  });

  it('shows the error if the events cannot be fetched', async () => {
    const r = await renderPage({ listResult: { errors: [{ message: 'Search is down' } as never] } });

    expect(await r.findByText(/Search is down/)).toBeTruthy();
  });
});
