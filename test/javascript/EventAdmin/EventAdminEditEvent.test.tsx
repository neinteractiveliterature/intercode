import { GraphQLError } from 'graphql';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as EventAdminEditEvent, loader } from '../../../app/javascript/EventAdmin/EventAdminEditEvent';
import { UpdateEventDocument } from '../../../app/javascript/EventAdmin/mutations.generated';
import { EventAdminSingleEventQueryDocument } from '../../../app/javascript/EventAdmin/queries.generated';
import { SiteMode } from '../../../app/javascript/graphqlTypes.generated';
import { buildAdminEvent, buildEventAdminEventsData, buildEventAdminSingleEventData } from '../fixtures/eventAdmin';

describe('EventAdminEditEvent', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const updates = vi.fn();
  let updateError: string | undefined;
  let drops: { method: string; path: string }[];

  beforeEach(() => {
    user = userEvent.setup();
    updates.mockReset();
    updateError = undefined;
    drops = [];
  });

  const renderPage = ({ event = buildAdminEvent(), siteMode = SiteMode.Convention } = {}) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: EventAdminSingleEventQueryDocument, variables: { eventId: event.id } },
        result: { data: buildEventAdminSingleEventData(event) },
        maxUsageCount: 10,
      },
      {
        request: {
          query: UpdateEventDocument,
          variables: (variables: unknown) => {
            updates(variables);
            return true;
          },
        },
        result: () =>
          updateError
            ? { errors: [new GraphQLError(updateError)] }
            : { data: { updateEvent: { __typename: 'UpdateEventPayload', event } } },
      },
    ];

    return renderRoute(
      [
        {
          id: 'EventAdmin',
          path: '/admin_events',
          loader: () => buildEventAdminEventsData({ convention: { site_mode: siteMode } }),
          children: [
            {
              path: ':eventCategoryId',
              children: [
                { path: 'events/:eventId/edit', loader, Component: EventAdminEditEvent },
                {
                  path: 'events/:eventId/drop',
                  action: ({ request }) => {
                    drops.push({ method: request.method, path: new URL(request.url).pathname });
                    return null;
                  },
                },
                { path: '', Component: () => <div>Category page</div> },
              ],
            },
            { path: ':eventId/edit', loader, Component: EventAdminEditEvent },
            { path: '', Component: () => <div>Event admin home</div> },
          ],
        },
      ],
      {
        apolloMocks,
        initialEntries: [
          siteMode === SiteMode.SingleEvent
            ? `/admin_events/${event.id}/edit`
            : `/admin_events/4/events/${event.id}/edit`,
        ],
      },
    );
  };

  type Rendered = Awaited<ReturnType<typeof renderPage>>;
  const titleField = (r: Rendered) => r.findByLabelText('Title*', { selector: 'input' });

  it('shows the event’s current values', async () => {
    const r = await renderPage();

    expect(((await titleField(r)) as HTMLInputElement).value).toBe('Big Game');
  });

  it('saves the changes, then goes back up to the event admin', async () => {
    const r = await renderPage();
    const title = await titleField(r);

    await user.type(title, ' Redux');
    await user.click(r.getByRole('button', { name: 'Save event' }));

    expect(await r.findByText('Event admin home')).toBeTruthy();
    expect(updates).toHaveBeenCalledTimes(1);
    const { input } = updates.mock.calls[0][0];
    expect(input.id).toBe('9');
    expect(input.event.eventCategoryId).toBe('4');
    expect(JSON.parse(input.event.form_response_attrs_json).title).toBe('Big Game Redux');
  });

  it('shows the error and stays put if saving fails', async () => {
    updateError = 'Title is too long';
    const r = await renderPage();
    await user.type(await titleField(r), '!');

    await user.click(r.getByRole('button', { name: 'Save event' }));

    expect(await r.findByText(/Title is too long/)).toBeTruthy();
    expect(r.queryByText('Event admin home')).toBeNull();
  });

  it('does not save while a required field is empty', async () => {
    const r = await renderPage();
    await user.clear(await titleField(r));

    await user.click(r.getByRole('button', { name: 'Save event' }));

    expect(updates).not.toHaveBeenCalled();
  });

  describe('dropping the event', () => {
    it('asks first, then submits to the event’s drop route', async () => {
      const r = await renderPage();
      await titleField(r);

      await user.click(r.getByRole('button', { name: 'Drop event' }));
      expect(await r.findByText(/Big Game/, { selector: '.modal-body *, .modal-body' })).toBeTruthy();
      expect(drops).toEqual([]);
      await user.click(r.getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(drops).toHaveLength(1));
      expect(drops[0]).toEqual({ method: 'PATCH', path: '/admin_events/4/events/9/drop' });
    });

    it('is not offered for an event that is already dropped', async () => {
      const r = await renderPage({ event: buildAdminEvent({ status: 'dropped' }) });
      await titleField(r);

      expect(r.queryByRole('button', { name: 'Drop event' })).toBeNull();
    });

    it('is not offered on a single-event site', async () => {
      const r = await renderPage({ siteMode: SiteMode.SingleEvent });
      await titleField(r);

      expect(r.queryByRole('button', { name: 'Drop event' })).toBeNull();
    });
  });

  describe('single-event sites', () => {
    it('goes to the home page after saving', async () => {
      const r = await renderPage({ siteMode: SiteMode.SingleEvent });
      await user.type(await titleField(r), '!');

      await user.click(r.getByRole('button', { name: 'Save event' }));

      await waitFor(() => expect(updates).toHaveBeenCalled());
      expect(await r.findByRole('link', { name: 'Cancel' })).toHaveAttribute('href', '/');
    });
  });
});
