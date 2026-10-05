import { redirect } from 'react-router';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as NewEvent } from '../../../app/javascript/EventAdmin/NewEvent';
import { SchedulingUi, SiteMode } from '../../../app/javascript/graphqlTypes.generated';
import { buildAdminEventCategory, buildEventAdminEventsData } from '../fixtures/eventAdmin';

describe('NewEvent', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: { method: string; path: string; body: unknown }[];
  let actionResult: () => unknown;

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
    actionResult = () => redirect('/admin_events/4');
  });

  const tabletop = () => buildAdminEventCategory({ id: '4', name: 'Tabletop RPG' });
  const panel = () => buildAdminEventCategory({ id: '5', name: 'Panel' });

  const renderPage = ({
    categories = [tabletop(), panel()],
    path = '/admin_events/events/new',
    siteMode = SiteMode.Convention,
  } = {}) =>
    renderRoute(
      [
        {
          id: 'EventAdmin',
          path: '/admin_events',
          loader: () => buildEventAdminEventsData({ categories, convention: { site_mode: siteMode } }),
          children: [
            { path: 'events/new', Component: NewEvent },
            { path: ':eventCategoryId/events/new', Component: NewEvent },
            {
              path: ':eventCategoryId/events',
              action: async ({ request, params }) => {
                submissions.push({
                  method: request.method,
                  path: new URL(request.url).pathname,
                  body: await request.json(),
                });
                return params.eventCategoryId ? actionResult() : null;
              },
            },
            { path: ':eventCategoryId', Component: () => <div>Category page</div> },
          ],
        },
      ],
      { initialEntries: [path] },
    );

  type Rendered = Awaited<ReturnType<typeof renderPage>>;

  const typeTitle = async (r: Rendered, title: string) => {
    await user.type(await r.findByLabelText('Title*', { selector: 'input' }), title);
  };

  it('cannot create an event until a category is chosen', async () => {
    const r = await renderPage();

    expect(await r.findByRole('button', { name: 'Create event' })).toBeDisabled();
  });

  it('starts on the category in the URL', async () => {
    const r = await renderPage({ path: '/admin_events/5-panel/events/new' });

    expect(((await r.findByLabelText('Event Category')) as HTMLSelectElement).value).toBe('5');
    expect(r.getByRole('button', { name: 'Create event' })).toBeEnabled();
  });

  it('starts on the only category when there is just one', async () => {
    const r = await renderPage({ categories: [tabletop()] });

    expect(((await r.findByLabelText('Event Category')) as HTMLSelectElement).value).toBe('4');
  });

  it('shows the form for the chosen category', async () => {
    const r = await renderPage();
    await r.findByLabelText('Event Category');
    expect(r.queryByLabelText('Title*', { selector: 'input' })).toBeNull();

    await user.selectOptions(r.getByLabelText('Event Category'), '4');

    expect(await r.findByLabelText('Title*', { selector: 'input' })).toBeTruthy();
  });

  it('creates the event in the category with what was filled in, then goes to the category', async () => {
    const r = await renderPage({ path: '/admin_events/4/events/new' });
    await typeTitle(r, 'Big Game');

    await user.click(r.getByRole('button', { name: 'Create event' }));

    expect(await r.findByText('Category page')).toBeTruthy();
    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({ method: 'POST', path: '/admin_events/4/events' });
    expect(submissions[0].body).toMatchObject({
      eventCategory: { id: '4' },
      event: { event_category: { id: '4' }, form_response_attrs: expect.objectContaining({ title: 'Big Game' }) },
      signedImageBlobIds: [],
    });
    expect((submissions[0].body as { run?: unknown }).run).toBeUndefined();
  });

  it('does not submit while required fields are missing', async () => {
    const r = await renderPage({ path: '/admin_events/4/events/new' });
    await r.findByLabelText('Title*', { selector: 'input' });

    await user.click(r.getByRole('button', { name: 'Create event' }));

    expect(submissions).toEqual([]);
  });

  it('shows the error if creating fails', async () => {
    actionResult = () => new Error('Title has already been taken');
    const r = await renderPage({ path: '/admin_events/4/events/new' });
    await typeTitle(r, 'Big Game');

    await user.click(r.getByRole('button', { name: 'Create event' }));

    await waitFor(() => expect(submissions).toHaveLength(1));
    expect(await r.findByText(/Title has already been taken/)).toBeTruthy();
  });

  it('cancels back out of the new event page', async () => {
    const r = await renderPage({ path: '/admin_events/4/events/new' });

    expect(((await r.findByRole('link', { name: 'Cancel' })) as HTMLAnchorElement).getAttribute('href')).toBeTruthy();
  });

  it('cancels to the home page in a single-event site', async () => {
    const r = await renderPage({ path: '/admin_events/4/events/new', siteMode: SiteMode.SingleEvent });

    expect(((await r.findByRole('link', { name: 'Cancel' })) as HTMLAnchorElement).getAttribute('href')).toBe('/');
  });

  describe('a single-run category', () => {
    const filler = () => buildAdminEventCategory({ id: '6', name: 'Filler', scheduling_ui: SchedulingUi.SingleRun });

    it('asks for a length before showing the schedule fields', async () => {
      const r = await renderPage({ categories: [filler()], path: '/admin_events/6/events/new' });
      await typeTitle(r, 'Lunch');

      expect(r.getByText('Please specify a length of time for this event.')).toBeTruthy();
      expect(r.getByRole('button', { name: 'Create event' })).toBeDisabled();
      expect(r.queryByText('Schedule note', { exact: false })).toBeNull();
    });

    it('shows the run fields once there is a length', async () => {
      const r = await renderPage({ categories: [filler()], path: '/admin_events/6/events/new' });
      await typeTitle(r, 'Lunch');

      await user.type(r.getByLabelText('Event length', { selector: 'input' }), '1');

      expect(r.queryByText('Please specify a length of time for this event.')).toBeNull();
      expect(await r.findByLabelText(/schedule note/i)).toBeTruthy();
      expect(r.getByRole('button', { name: 'Create event' })).toBeEnabled();
    });

    it('does not create the event without a start time for its run', async () => {
      const r = await renderPage({ categories: [filler()], path: '/admin_events/6/events/new' });
      await typeTitle(r, 'Lunch');
      await user.type(r.getByLabelText('Event length', { selector: 'input' }), '1');
      await r.findByLabelText(/schedule note/i);

      await user.click(r.getByRole('button', { name: 'Create event' }));

      expect(submissions).toEqual([]);
    });
  });
});
