import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as DroppedEventAdmin, loader } from '../../../app/javascript/EventAdmin/DroppedEventAdmin';
import { EventAdminEventsQueryDocument } from '../../../app/javascript/EventAdmin/queries.generated';
import { SchedulingUi } from '../../../app/javascript/graphqlTypes.generated';
import { buildAdminEvent, buildAdminEventCategory, buildEventAdminEventsData } from '../fixtures/eventAdmin';

describe('DroppedEventAdmin', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let restores: { method: string; path: string }[];

  beforeEach(() => {
    user = userEvent.setup();
    restores = [];
  });

  const renderPage = (events: ReturnType<typeof buildAdminEvent>[]) =>
    renderRoute(
      [
        {
          path: '/admin_events/dropped_events',
          loader,
          Component: DroppedEventAdmin,
        },
        {
          path: '/admin_events/:eventCategoryId/events/:eventId/restore',
          action: ({ request }) => {
            restores.push({ method: request.method, path: new URL(request.url).pathname });
            return null;
          },
        },
      ],
      {
        apolloMocks: [
          {
            request: { query: EventAdminEventsQueryDocument },
            result: {
              data: buildEventAdminEventsData({
                categories: [
                  buildAdminEventCategory({ id: '4' }),
                  buildAdminEventCategory({ id: '6', name: 'Filler', scheduling_ui: SchedulingUi.SingleRun }),
                ],
                events,
              }),
            },
          },
        ],
        initialEntries: ['/admin_events/dropped_events'],
      },
    );

  it('says so when there are no dropped events', async () => {
    const { findByText } = await renderPage([buildAdminEvent({ status: 'active' })]);

    expect(await findByText(/There are no dropped events to display/)).toBeTruthy();
  });

  it('lists dropped events by title, leaving out active ones', async () => {
    const { findAllByRole, queryByText } = await renderPage([
      buildAdminEvent({ id: '1', title: 'Zebra Game', status: 'dropped' }),
      buildAdminEvent({ id: '2', title: 'apple Game', status: 'dropped' }),
      buildAdminEvent({ id: '3', title: 'Still Running', status: 'active' }),
    ]);

    const rows = await findAllByRole('row');
    expect(rows.map((row) => row.textContent)).toEqual(['apple GameRestore', 'Zebra GameRestore']);
    expect(queryByText('Still Running')).toBeNull();
  });

  it('leaves out dropped single-run events, which cannot be restored', async () => {
    const { findByText, queryByText } = await renderPage([
      buildAdminEvent({ id: '1', title: 'Regular', status: 'dropped' }),
      buildAdminEvent({
        id: '2',
        title: 'Lunch',
        status: 'dropped',
        event_category: { __typename: 'EventCategory', id: '6' },
      }),
    ]);

    expect(await findByText('Regular')).toBeTruthy();
    expect(queryByText('Lunch')).toBeNull();
  });

  it('asks first, then submits to the event’s restore route', async () => {
    const { findByRole, getByRole, findByText } = await renderPage([
      buildAdminEvent({ id: '1', title: 'Regular', status: 'dropped' }),
    ]);

    await user.click(await findByRole('button', { name: 'Restore' }));
    expect(await findByText(/Are you sure you want to restore this event/)).toBeTruthy();
    expect(restores).toEqual([]);
    await user.click(getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(restores).toHaveLength(1));
    expect(restores[0]).toEqual({ method: 'POST', path: '/admin_events/4/events/1/restore' });
  });
});
