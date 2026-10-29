import { vi } from 'vitest';
import { Suspense } from 'react';
import { useLocation } from 'react-router';
import { MockLink } from '@apollo/client/testing';
import { DateTime } from 'luxon';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as ScheduleApp, clientLoader as loader } from '../../../app/javascript/EventsApp/ScheduleApp';
import { redirectToFirstDayMiddleware } from '../../../app/javascript/EventsApp/conventionDayUrls';
import { AppRootQueryDocument } from '../../../app/javascript/appRootQueries.generated';
import {
  ScheduleGridConventionDataQueryData,
  ScheduleGridConventionDataQueryDocument,
  ScheduleGridEventsQueryDocument,
} from '../../../app/javascript/EventsApp/ScheduleGrid/queries.generated';
import { appRootContextDefaultValue, AppRootContextValue } from '../../../app/javascript/AppRootContext';
import { SiteMode } from '../../../app/javascript/graphqlTypes.generated';
import Timespan from '../../../app/javascript/Timespan';
import { buildMultipleChoiceItem } from '../fixtures/formItems';
import { buildCatalogCategory, buildCatalogConvention, buildCatalogFormItem } from '../fixtures/eventCatalog';
import { buildAppRootConvention, buildAppRootData } from '../fixtures/appRoot';

// The grids are big and have their own tests; here they're a marker saying which one was asked for
vi.mock('../../../app/javascript/EventsApp/ScheduleGrid', () => ({
  default: ({ configKey, fetchFormItemIdentifiers }: { configKey: string; fetchFormItemIdentifiers: string[] }) => (
    <div>
      grid: {configKey} ({fetchFormItemIdentifiers.join(',')})
    </div>
  ),
}));

const SHORT_CON = Timespan.finiteFromDateTimes(
  DateTime.fromISO('2026-06-05T00:00:00Z'),
  DateTime.fromISO('2026-06-07T23:00:00Z'),
);
const LONG_CON = Timespan.finiteFromDateTimes(
  DateTime.fromISO('2026-06-01T00:00:00Z'),
  DateTime.fromISO('2026-06-20T23:00:00Z'),
);

describe('ScheduleApp', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  const loaderData = (
    categories = [buildCatalogCategory({ id: '4' })],
  ): { data: ScheduleGridConventionDataQueryData } => ({
    data: {
      __typename: 'Query',
      currentAbility: { __typename: 'Ability', can_create_cms_partials: false },
      convention: {
        ...buildCatalogConvention(categories),
        blockPartial: null,
      },
    },
  });

  const SearchDisplay = () => <div data-testid="search">{useLocation().search}</div>;

  // Runs the route's real loader (and the redirect from the bare /events/schedule), with the queries it makes mocked
  const renderPage = ({
    ability = {},
    conventionTimespan = SHORT_CON,
    siteMode = SiteMode.Convention,
    categories,
    search = '',
    myProfile = false,
    eventsLog,
    eventsDelay,
  }: {
    ability?: Partial<AppRootContextValue['currentAbility']>;
    conventionTimespan?: Timespan;
    siteMode?: SiteMode;
    categories?: ReturnType<typeof buildCatalogCategory>[];
    search?: string;
    myProfile?: boolean;
    // records what the events query is asked for (the variables of each request) and how many times it was served
    eventsLog?: { variables: string[]; served: number };
    eventsDelay?: number;
  } = {}) => {
    const currentAbility = {
      ...appRootContextDefaultValue.currentAbility,
      can_read_schedule: true,
      can_read_schedule_with_counts: false,
      ...ability,
    };
    const appRootData = buildAppRootData(
      buildAppRootConvention({
        site_mode: siteMode,
        starts_at: conventionTimespan.start?.toISO() ?? null,
        ends_at: conventionTimespan.finish?.toISO() ?? null,
        timezone_name: 'UTC',
      }),
    );
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: AppRootQueryDocument },
        result: { data: { ...appRootData, currentAbility } },
        maxUsageCount: 10,
      },
      {
        request: { query: ScheduleGridConventionDataQueryDocument },
        result: loaderData(categories),
        maxUsageCount: 10,
      },
      {
        request: {
          query: ScheduleGridEventsQueryDocument,
          variables: (variables: Record<string, unknown>) => {
            eventsLog?.variables.push(JSON.stringify(variables));
            return true;
          },
        },
        delay: eventsDelay,
        result: () => {
          if (eventsLog) {
            eventsLog.served += 1;
          }
          return { data: { __typename: 'Query', convention: { __typename: 'Convention', id: '1', events: [] } } };
        },
        maxUsageCount: 10,
      },
    ];
    return renderRoute(
      [
        { path: '/events/schedule', middleware: [redirectToFirstDayMiddleware] },
        {
          path: '/events/schedule/:day',
          loader,
          Component: () => (
            <Suspense fallback={<div>Loading</div>}>
              <ScheduleApp />
              <SearchDisplay />
            </Suspense>
          ),
        },
      ],
      {
        apolloMocks,
        initialEntries: [`/events/schedule${search}`],
        appRootContextValue: {
          timezoneName: 'UTC',
          conventionTimespan,
          siteMode,
          currentAbility,
          ...(myProfile ? { myProfile: { __typename: 'UserConProfile', id: '2', name: 'Me' } as never } : {}),
        },
      },
    );
  };

  type Rendered = Awaited<ReturnType<typeof renderPage>>;

  const viewNames = async (r: Rendered) => {
    await user.click(await r.findByRole('button', { name: /View type/ }));
    return r
      .getAllByRole('button')
      .filter((button) => button.classList.contains('dropdown-item'))
      .map((b) => b.textContent);
  };

  it('has a breadcrumb for the event schedule', async () => {
    const r = await renderPage();

    expect(await r.findByText('Event Schedule')).toBeTruthy();
  });

  describe('choosing the view', () => {
    it('starts on the first grid on a wide screen', async () => {
      const r = await renderPage();

      expect(await r.findByText(/grid: con_schedule \(/)).toBeTruthy();
    });

    it('starts on the list on a narrow screen', async () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);
      const r = await renderPage();

      expect(await r.findByRole('button', { name: /View type/ })).toHaveTextContent(/List view/);
      expect(r.queryByText(/grid:/)).toBeNull();
    });

    it('goes back to the view that was chosen last time', async () => {
      window.localStorage.setItem('schedule:view', 'con_schedule_by_room');
      const r = await renderPage();

      expect(await r.findByText(/grid: con_schedule_by_room/)).toBeTruthy();
    });

    it('ignores a remembered view that does not exist', async () => {
      window.localStorage.setItem('schedule:view', 'nonsense');
      const r = await renderPage();

      expect(await r.findByText(/grid: con_schedule \(/)).toBeTruthy();
    });

    it('lets the view be chosen, and remembers it', async () => {
      const r = await renderPage();
      await r.findByText(/grid: con_schedule \(/);

      await user.click(await r.findByRole('button', { name: /View type/ }));
      await user.click(await r.findByRole('button', { name: 'List view' }));

      expect(window.localStorage.getItem('schedule:view')).toBe('list');
      await waitFor(() => expect(r.queryByText(/grid:/)).toBeNull());
    });

    it('does not offer the grid with counts to someone who cannot read the schedule with counts', async () => {
      const r = await renderPage();

      const names = await viewNames(r);

      expect(names).toContain('List view');
      expect(names).not.toContain('Grid view with counts');
    });

    it('offers the grid with counts to someone who can', async () => {
      const r = await renderPage({ ability: { can_read_schedule_with_counts: true } });

      expect(await viewNames(r)).toContain('Grid view with counts');
    });

    it('offers only the list for a convention a week or longer, which needs dates', async () => {
      const r = await renderPage({ conventionTimespan: LONG_CON });

      await waitFor(() => expect(r.queryByRole('button', { name: /View type: List view/ })).toBeNull());
      expect(r.queryByText(/grid:/)).toBeNull();
    });

    it('falls back to the list if the remembered view is a grid that is not available', async () => {
      window.localStorage.setItem('schedule:view', 'schedule_with_counts');
      const r = await renderPage({ ability: { can_read_schedule_with_counts: false } });

      await waitFor(() => expect(r.queryByText(/grid: schedule_with_counts/)).toBeNull());
      expect(await r.findByText(/grid: con_schedule \(/)).toBeTruthy();
    });
  });

  describe('the view in the URL', () => {
    it('shows the view named in the URL, even if another was chosen last time', async () => {
      window.localStorage.setItem('schedule:view', 'list');
      const r = await renderPage({ search: '?view=con_schedule_by_room' });

      expect(await r.findByText(/grid: con_schedule_by_room/)).toBeTruthy();
    });

    it('ignores a view in the URL that does not exist or is not available', async () => {
      const nonsense = await renderPage({ search: '?view=nonsense' });
      expect(await nonsense.findByText(/grid: con_schedule \(/)).toBeTruthy();
      nonsense.unmount();

      const unavailable = await renderPage({ search: '?view=schedule_with_counts' });
      expect(await unavailable.findByText(/grid: con_schedule \(/)).toBeTruthy();
    });

    it('puts the chosen view in the URL, keeping the rest of it, as well as remembering it', async () => {
      const r = await renderPage({ search: '?foo=bar' });
      await r.findByText(/grid: con_schedule \(/);

      await user.click(await r.findByRole('button', { name: /View type/ }));
      await user.click(await r.findByRole('button', { name: 'List view' }));

      await waitFor(() => expect(r.getByTestId('search')).toHaveTextContent('view=list'));
      expect(r.getByTestId('search')).toHaveTextContent('foo=bar');
      expect(window.localStorage.getItem('schedule:view')).toBe('list');
    });

    it('still loads the saved personal filters when the only thing in the URL is the view', async () => {
      window.localStorage.setItem(
        'schedule:personalFilters',
        JSON.stringify([
          { id: 'my_rating', value: [2] },
          { id: 'hide_conflicts', value: true },
        ]),
      );
      const r = await renderPage({ search: '?view=con_schedule', myProfile: true });

      await waitFor(() => expect(r.getByTestId('search')).toHaveTextContent('filters.my_rating'));
      expect(r.getByTestId('search')).toHaveTextContent('view=con_schedule');
    });
  });

  describe('asking for the events', () => {
    it('is done by the loader, for the list, in the way the list asks for them', async () => {
      const eventsLog = { variables: [] as string[], served: 0 };
      const r = await renderPage({ search: '?view=list', eventsLog });
      await r.findByText('Event Schedule');

      await waitFor(() => expect(eventsLog.served).toBeGreaterThan(0));
      // the list asks for these same events again once it renders: it joins the loader's request instead of making one
      expect(eventsLog.served).toBe(1);
      expect(new Set(eventsLog.variables)).toEqual(
        new Set([JSON.stringify({ filters: {}, fetchFormItemIdentifiers: [] })]),
      );
    });

    it('is done by the loader, for the day, for a grid', async () => {
      const eventsLog = { variables: [] as string[], served: 0 };
      const r = await renderPage({ eventsLog });
      await r.findByText(/grid: con_schedule \(/);

      await waitFor(() => expect(eventsLog.served).toBe(1));
      const [variables] = Array.from(new Set(eventsLog.variables)).map((v) => JSON.parse(v));
      expect(variables).toMatchObject({ fetchFormItemIdentifiers: [], extendedCounts: false, filters: {} });
      expect(new Date(variables.finish).getTime()).toBeGreaterThan(new Date(variables.start).getTime());
    });

    it('includes the filters in the URL', async () => {
      const eventsLog = { variables: [] as string[], served: 0 };
      const r = await renderPage({ search: '?view=list&filters.title=chess', eventsLog });
      await r.findByText('Event Schedule');

      await waitFor(() => expect(eventsLog.served).toBeGreaterThan(0));
      expect(JSON.parse(eventsLog.variables[0]).filters).toEqual({ title: 'chess' });
    });

    it('includes the form items that can be filtered on', async () => {
      const system = buildMultipleChoiceItem({
        identifier: 'system',
        caption: 'System',
        choices: [{ caption: 'D&D', value: 'dnd' }],
      });
      const eventsLog = { variables: [] as string[], served: 0 };
      const r = await renderPage({
        search: '?view=list',
        categories: [buildCatalogCategory({ id: '4' }, [buildCatalogFormItem(system, 'Game system')])],
        eventsLog,
      });
      await r.findByText('Event Schedule');

      await waitFor(() => expect(eventsLog.served).toBeGreaterThan(0));
      expect(JSON.parse(eventsLog.variables[0]).fetchFormItemIdentifiers).toEqual(['system']);
    });

    it('does not make the schedule wait for them', async () => {
      const eventsLog = { variables: [] as string[], served: 0 };
      const r = await renderPage({ eventsLog, eventsDelay: 1000 });

      expect(await r.findByText('Event Schedule')).toBeTruthy();
      expect(eventsLog.served).toBe(0);
    });

    it('is not done for someone who cannot read the schedule', async () => {
      const eventsLog = { variables: [] as string[], served: 0 };
      const r = await renderPage({ ability: { can_read_schedule: false }, eventsLog });
      await r.findByText(/not authorized/);

      expect(eventsLog.variables).toEqual([]);
    });
  });

  describe('authorization', () => {
    it('says so, instead of showing a schedule, to someone who cannot read it', async () => {
      const r = await renderPage({ ability: { can_read_schedule: false } });

      expect(await r.findByText(/not authorized/)).toBeTruthy();
      expect(r.queryByText(/grid:/)).toBeNull();
    });

    it('moves someone off the counts grid to a plain one if they can only read the plain schedule', async () => {
      window.localStorage.setItem('schedule:view', 'schedule_with_counts');
      const r = await renderPage({ ability: { can_read_schedule: true, can_read_schedule_with_counts: false } });

      expect(await r.findByText(/grid: con_schedule \(/)).toBeTruthy();
    });
  });

  describe('filters', () => {
    const system = buildMultipleChoiceItem({
      identifier: 'system',
      caption: 'System',
      choices: [
        { caption: 'D&D', value: 'dnd' },
        { caption: 'Fate', value: 'fate' },
      ],
    });
    const withSystem = () => [buildCatalogCategory({ id: '4' }, [buildCatalogFormItem(system, 'Game system')])];

    it('offers a dropdown for each filterable form item, and fetches those items with the schedule', async () => {
      const r = await renderPage({ categories: withSystem() });

      expect(await r.findByRole('button', { name: 'Game system' })).toBeTruthy();
      expect(await r.findByText(/grid: con_schedule \(system\)/)).toBeTruthy();
    });

    it('offers none when no form items are exposed', async () => {
      const r = await renderPage();
      await r.findByText(/grid:/);

      expect(r.queryByRole('button', { name: 'Game system' })).toBeNull();
    });

    it('offers the personal filters on the grids that have them, not on the one with counts', async () => {
      const withFilters = await renderPage();
      await withFilters.findByText(/grid: con_schedule \(/);
      // (the filters dropdown is the only thing with a Select all)
      expect(withFilters.getByRole('button', { name: 'Select all' })).toBeTruthy();
      withFilters.unmount();

      window.localStorage.setItem('schedule:view', 'schedule_with_counts');
      const withCounts = await renderPage({ ability: { can_read_schedule_with_counts: true } });
      await withCounts.findByText(/grid: schedule_with_counts/);
      expect(withCounts.queryByRole('button', { name: 'Select all' })).toBeNull();
    });
  });
});
