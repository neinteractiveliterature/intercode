import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import {
  Component as CategorySpecificEventAdmin,
  loader as categoryLoader,
} from '../../../app/javascript/EventAdmin/CategorySpecificEventAdmin';
import { EventAdminEventsQueryDocument } from '../../../app/javascript/EventAdmin/queries.generated';
import { SchedulingUi } from '../../../app/javascript/graphqlTypes.generated';
import {
  AdminEvent,
  AdminEventCategory,
  buildAdminEvent,
  buildAdminEventCategory,
  buildAdminRun,
  buildEventAdminEventsData,
} from '../fixtures/eventAdmin';

describe('the event admin category pages', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: { method: string; path: string; body: Record<string, string> }[];

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
  });

  const recordSubmission = async ({ request }: { request: Request }) => {
    const formData = await request.formData().catch(() => new FormData());
    submissions.push({
      method: request.method,
      path: new URL(request.url).pathname,
      body: Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)])),
    });
    return null;
  };

  const renderCategory = (
    path: string,
    { categories, events }: { categories: AdminEventCategory[]; events: AdminEvent[] },
  ) => {
    const data = buildEventAdminEventsData({ categories, events });
    return renderRoute(
      [
        {
          id: 'EventAdmin',
          path: '/admin_events',
          loader: () => data,
          children: [
            {
              path: ':eventCategoryId',
              children: [
                {
                  path: '',
                  loader: categoryLoader,
                  Component: CategorySpecificEventAdmin,
                  children: [
                    { path: 'events/:eventId/admin_notes', action: recordSubmission },
                    { path: 'events/:eventId/drop', action: recordSubmission },
                  ],
                },
                { path: 'events/new', Component: () => <div>New event page</div> },
                { path: 'events/:eventId/edit', Component: () => <div>Edit event page</div> },
              ],
            },
          ],
        },
      ],
      {
        apolloMocks: [{ request: { query: EventAdminEventsQueryDocument }, result: { data }, maxUsageCount: 10 }],
        initialEntries: [path],
        appRootContextValue: { timezoneName: 'UTC' },
      },
    );
  };

  const regular = (overrides: Partial<AdminEventCategory> = {}) =>
    buildAdminEventCategory({ id: '4', name: 'Tabletop RPG', ...overrides });
  const singleRun = () => buildAdminEventCategory({ id: '6', name: 'Filler', scheduling_ui: SchedulingUi.SingleRun });
  const recurring = () => buildAdminEventCategory({ id: '7', name: 'Panel', scheduling_ui: SchedulingUi.Recurring });

  describe('picking the page for the category', () => {
    it('shows the runs table for a regular category', async () => {
      const r = await renderCategory('/admin_events/4', { categories: [regular()], events: [] });

      expect(await r.findByRole('columnheader', { name: 'Runs' })).toBeTruthy();
    });

    it('shows a list of events for a single-run category', async () => {
      const r = await renderCategory('/admin_events/6', {
        categories: [singleRun()],
        events: [
          buildAdminEvent({
            id: '1',
            title: 'Lunch',
            event_category: { __typename: 'EventCategory', id: '6' },
            runs: [buildAdminRun()],
          }),
        ],
      });

      expect(await r.findByText('Lunch')).toBeTruthy();
      expect(r.queryByRole('columnheader', { name: 'Runs' })).toBeNull();
    });

    it('shows sections for a recurring category', async () => {
      const r = await renderCategory('/admin_events/7', {
        categories: [recurring()],
        events: [
          buildAdminEvent({ id: '1', title: 'Open Gaming', event_category: { __typename: 'EventCategory', id: '7' } }),
        ],
      });

      expect(await r.findByRole('button', { name: /Open Gaming/ })).toBeTruthy();
    });

    it('goes by the number at the start of the category id in the URL', async () => {
      const r = await renderCategory('/admin_events/4-tabletop-rpg', { categories: [regular()], events: [] });

      expect(await r.findByRole('columnheader', { name: 'Runs' })).toBeTruthy();
    });

    it.each([['/admin_events/999'], ['/admin_events/nonsense']])('is a 404 for %s', async (path) => {
      const r = await renderCategory(path, { categories: [regular()], events: [] });

      await waitFor(() => expect(r.queryByRole('columnheader', { name: 'Runs' })).toBeNull());
    });
  });

  describe('the regular category table', () => {
    const tableEvents = () => [
      buildAdminEvent({ id: '1', title: 'The Zebra Game', length_seconds: 3 * 3600 }),
      buildAdminEvent({ id: '2', title: 'apple Game', length_seconds: 90 * 60 }),
      buildAdminEvent({ id: '3', title: 'Dropped One', status: 'dropped' }),
      buildAdminEvent({
        id: '4',
        title: 'Other Category',
        event_category: { __typename: 'EventCategory', id: '99' },
      }),
    ];

    it('lists the category’s active events, ignoring leading articles and punctuation when sorting', async () => {
      const r = await renderCategory('/admin_events/4', { categories: [regular()], events: tableEvents() });

      const rows = await r.findAllByRole('row');
      const titles = rows.slice(1).map((row) => within(row).getAllByRole('cell')[0].textContent);
      expect(titles[0]).toContain('apple Game');
      expect(titles[1]).toContain('The Zebra Game');
      expect(titles).toHaveLength(2);
    });

    it('shows each event’s length', async () => {
      const r = await renderCategory('/admin_events/4', { categories: [regular()], events: tableEvents() });

      const rows = await r.findAllByRole('row');
      expect(within(rows[1]).getAllByRole('cell')[1].textContent).toBe('1:30');
      expect(within(rows[2]).getAllByRole('cell')[1].textContent).toBe('3:00');
    });

    it('links to creating a new event and to editing an existing one', async () => {
      const r = await renderCategory('/admin_events/4', { categories: [regular()], events: tableEvents() });

      expect((await r.findByRole('link', { name: 'Create new Tabletop RPG event' })).getAttribute('href')).toBe(
        '/admin_events/4/events/new',
      );
      expect(r.getByRole('link', { name: 'apple Game' }).getAttribute('href')).toBe('/admin_events/4/events/2/edit');
    });

    describe('an event’s runs', () => {
      const runs = () => [
        buildAdminRun({
          id: '31',
          starts_at: '2026-06-06T18:00:00Z',
          title_suffix: 'Evening',
          schedule_note: 'Bring dice',
        }),
        buildAdminRun({ id: '32', starts_at: '2026-06-05T18:00:00Z', rooms: [], room_names: [] }),
      ];

      it('shows each run, in time order, with its details, linked to its edit page', async () => {
        const r = await renderCategory('/admin_events/4', {
          categories: [regular()],
          events: [buildAdminEvent({ id: '2', title: 'Game', runs: runs() })],
        });

        const links = (await r.findAllByRole('link')).filter((link) => link.getAttribute('href')?.includes('/runs/'));
        expect(links.map((link) => link.getAttribute('href'))).toEqual([
          '/admin_events/4/events/2/runs/32/edit',
          '/admin_events/4/events/2/runs/31/edit',
          '/admin_events/4/events/2/runs/new',
        ]);
        const evening = links[1];
        expect(evening.textContent).toContain('Evening');
        expect(evening.textContent).toContain('Bring dice');
        expect(evening.textContent).toContain('Ballroom');
      });

      it('collapses more than two runs behind a button', async () => {
        const manyRuns = [...runs(), buildAdminRun({ id: '33', starts_at: '2026-06-07T18:00:00Z' })];
        const r = await renderCategory('/admin_events/4', {
          categories: [regular()],
          events: [buildAdminEvent({ id: '2', title: 'Game', runs: manyRuns })],
        });

        await user.click(await r.findByRole('button', { name: 'Show 3 runs' }));

        expect(r.queryByRole('button', { name: /Show 3 runs/ })).toBeNull();
        expect(
          r.getAllByRole('link').filter((link) => /\/runs\/\d+\/edit/.test(link.getAttribute('href') ?? '')),
        ).toHaveLength(3);
      });
    });

    describe('admin notes', () => {
      it('shows the notes and saves edits to the event’s admin notes route', async () => {
        const r = await renderCategory('/admin_events/4', {
          categories: [regular()],
          events: [buildAdminEvent({ id: '2', title: 'Game', admin_notes: 'Needs a table' })],
        });
        expect(await r.findByText('Needs a table')).toBeTruthy();

        await user.click(r.getByRole('button', { name: 'Edit' }));
        const notes = r.getByLabelText('Admin notes');
        await user.clear(notes);
        await user.type(notes, 'Needs two tables');
        await user.click(r.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(submissions).toHaveLength(1));
        expect(submissions[0]).toEqual({
          method: 'PATCH',
          path: '/admin_events/4/events/2/admin_notes',
          body: { admin_notes: 'Needs two tables' },
        });
      });
    });
  });

  describe('the single-run category list', () => {
    const lunch = () =>
      buildAdminEvent({
        id: '1',
        title: 'Lunch',
        event_category: { __typename: 'EventCategory', id: '6' },
        runs: [buildAdminRun({ starts_at: '2026-06-05T12:00:00Z' })],
      });

    it('lists events with when they happen, linked to editing them', async () => {
      const r = await renderCategory('/admin_events/6', { categories: [singleRun()], events: [lunch()] });

      expect(await r.findByText('Lunch')).toBeTruthy();
      expect(r.getByRole('link', { name: 'Edit' }).getAttribute('href')).toBe('/admin_events/6/events/1/edit');
      expect(within(r.getByText('Lunch').closest('tr') as HTMLElement).getAllByRole('cell')[0].textContent).toMatch(
        /12/,
      );
    });

    it('copes with an event that has no run yet', async () => {
      const r = await renderCategory('/admin_events/6', {
        categories: [singleRun()],
        events: [{ ...lunch(), runs: [] }],
      });

      expect(await r.findByText('Lunch')).toBeTruthy();
    });

    it('asks first, then submits to the event’s drop route', async () => {
      const r = await renderCategory('/admin_events/6', { categories: [singleRun()], events: [lunch()] });

      await user.click(await r.findByRole('button', { name: 'Drop event' }));
      expect(await r.findByText('Are you sure you want to drop this event?')).toBeTruthy();
      expect(submissions).toEqual([]);
      await user.click(r.getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'PATCH', path: '/admin_events/6/events/1/drop' });
    });
  });

  describe('the recurring category sections', () => {
    const open = () =>
      buildAdminEvent({
        id: '1',
        title: 'Open Gaming',
        description_html: '<p>Drop in and play</p>',
        length_seconds: 2 * 3600,
        event_category: { __typename: 'EventCategory', id: '7' },
        runs: [
          buildAdminRun({ id: '41', starts_at: '2026-06-06T15:00:00Z' }),
          buildAdminRun({ id: '40', starts_at: '2026-06-05T10:00:00Z' }),
          buildAdminRun({ id: '42', starts_at: '2026-06-05T20:00:00Z' }),
        ],
      });

    it('summarises each event’s runs and length, and links to editing it', async () => {
      const r = await renderCategory('/admin_events/7', { categories: [recurring()], events: [open()] });

      const summary = (await r.findByRole('button', { name: /Open Gaming/ })).textContent;
      expect(summary).toContain('(3 runs; 2:00 per run)');
      expect(r.getByRole('link', { name: 'Edit' }).getAttribute('href')).toBe('/admin_events/7/events/1/edit');
    });

    it('expands to show the description and the runs by day, in time order', async () => {
      const r = await renderCategory('/admin_events/7', { categories: [recurring()], events: [open()] });
      const toggle = await r.findByRole('button', { name: /Open Gaming/ });
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(r.queryByText('Drop in and play')).toBeNull();

      await user.click(toggle);

      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(r.getByText('Drop in and play')).toBeTruthy();
      const runLinks = r
        .getAllByRole('link')
        .filter((link) => /\/runs\/\d+\/edit/.test(link.getAttribute('href') ?? ''));
      expect(runLinks.map((link) => link.getAttribute('href'))).toEqual([
        '/admin_events/7/events/1/runs/40/edit',
        '/admin_events/7/events/1/runs/42/edit',
        '/admin_events/7/events/1/runs/41/edit',
      ]);
    });

    it('collapses again', async () => {
      const r = await renderCategory('/admin_events/7', { categories: [recurring()], events: [open()] });
      const toggle = await r.findByRole('button', { name: /Open Gaming/ });

      await user.click(toggle);
      await user.click(toggle);

      expect(r.queryByText('Drop in and play')).toBeNull();
    });

    it('offers to schedule additional runs', async () => {
      const r = await renderCategory('/admin_events/7', { categories: [recurring()], events: [open()] });
      await user.click(await r.findByRole('button', { name: /Open Gaming/ }));

      await user.click(r.getByRole('button', { name: 'Schedule additional runs' }));

      expect(await r.findByText('Schedule runs of Open Gaming')).toBeTruthy();
    });
  });
});
