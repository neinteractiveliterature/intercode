import { vi } from 'vitest';
import { Suspense } from 'react';
import { MockLink } from '@apollo/client/testing';
import { DateTime } from 'luxon';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as ScheduleApp } from '../../../app/javascript/EventsApp/ScheduleApp';
import { ScheduleGridConventionDataQueryData } from '../../../app/javascript/EventsApp/ScheduleGrid/queries.generated';
import { ScheduleGridEventsQueryDocument } from '../../../app/javascript/EventsApp/ScheduleGrid/queries.generated';
import { appRootContextDefaultValue, AppRootContextValue } from '../../../app/javascript/AppRootContext';
import { SiteMode } from '../../../app/javascript/graphqlTypes.generated';
import Timespan from '../../../app/javascript/Timespan';
import { buildMultipleChoiceItem } from '../fixtures/formItems';
import { buildCatalogCategory, buildCatalogConvention, buildCatalogFormItem } from '../fixtures/eventCatalog';

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

  const renderPage = ({
    ability = {},
    conventionTimespan = SHORT_CON,
    siteMode = SiteMode.Convention,
    categories,
    search = '',
    myProfile = false,
  }: {
    ability?: Partial<AppRootContextValue['currentAbility']>;
    conventionTimespan?: Timespan;
    siteMode?: SiteMode;
    categories?: ReturnType<typeof buildCatalogCategory>[];
    search?: string;
    myProfile?: boolean;
  } = {}) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: ScheduleGridEventsQueryDocument, variables: () => true },
        result: { data: { __typename: 'Query', convention: { __typename: 'Convention', id: '1', events: [] } } },
        maxUsageCount: 10,
      },
    ];
    return renderRoute(
      [
        {
          path: '/events/schedule',
          loader: () => loaderData(categories),
          Component: () => (
            <Suspense fallback={<div>Loading</div>}>
              <ScheduleApp />
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
          currentAbility: {
            ...appRootContextDefaultValue.currentAbility,
            can_read_schedule: true,
            can_read_schedule_with_counts: false,
            ...ability,
          },
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
