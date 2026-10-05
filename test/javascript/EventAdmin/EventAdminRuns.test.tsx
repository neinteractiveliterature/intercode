import { GraphQLError } from 'graphql';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import {
  Component as EditRun,
  action as editRunAction,
  loader as editRunLoader,
} from '../../../app/javascript/EventAdmin/EditRun';
import {
  Component as NewRun,
  action as newRunAction,
  loader as newRunLoader,
} from '../../../app/javascript/EventAdmin/NewRun';
import { action as deleteRunAction } from '../../../app/javascript/EventAdmin/SingleRunRoute';
import { buildRunInputFromFormData } from '../../../app/javascript/EventAdmin/buildRunInputFromFormData';
import {
  CreateRunDocument,
  DeleteRunDocument,
  UpdateRunDocument,
} from '../../../app/javascript/EventAdmin/mutations.generated';
import { EventAdminEventsQueryDocument } from '../../../app/javascript/EventAdmin/queries.generated';
import { buildAdminEvent, buildAdminRun, buildEventAdminEventsData } from '../fixtures/eventAdmin';

describe('buildRunInputFromFormData', () => {
  it('reads the run’s fields from the form', () => {
    const formData = new FormData();
    formData.append('room_ids', '2');
    formData.append('room_ids', '3');
    formData.append('starts_at', '2026-06-05T18:00:00Z');
    formData.append('title_suffix', 'Late');
    formData.append('schedule_note', 'Bring a snack');

    expect(buildRunInputFromFormData(formData)).toEqual({
      roomIds: ['2', '3'],
      starts_at: '2026-06-05T18:00:00Z',
      title_suffix: 'Late',
      schedule_note: 'Bring a snack',
    });
  });

  it('copes with a form that has no fields', () => {
    expect(buildRunInputFromFormData(new FormData())).toEqual({
      roomIds: [],
      starts_at: undefined,
      title_suffix: undefined,
      schedule_note: undefined,
    });
  });
});

describe('the run pages', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mutations = vi.fn();
  let mutationError: string | undefined;
  let deletes: { method: string; path: string }[];

  beforeEach(() => {
    user = userEvent.setup();
    mutations.mockReset();
    mutationError = undefined;
    deletes = [];
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const run = buildAdminRun({ id: '33' });
  const event = buildAdminEvent({ id: '9', runs: [run] });
  const data = () => buildEventAdminEventsData({ events: [event] });

  const mutationMock = (
    query: MockLink.MockedResponse['request']['query'],
    field: string,
  ): MockLink.MockedResponse => ({
    request: {
      query,
      variables: (variables: unknown) => {
        mutations(variables);
        return true;
      },
    },
    result: () =>
      mutationError
        ? { errors: [new GraphQLError(mutationError)] }
        : { data: { [field]: { __typename: 'Payload', run: { ...run, __typename: 'Run' } } } },
  });

  const renderPage = (path: string) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      { request: { query: EventAdminEventsQueryDocument }, result: { data: data() }, maxUsageCount: 20 },
      mutationMock(UpdateRunDocument, 'updateRun'),
      mutationMock(CreateRunDocument, 'createRun'),
      mutationMock(DeleteRunDocument, 'deleteRun'),
    ];
    return renderRoute(
      [
        {
          id: 'EventAdmin',
          path: '/admin_events',
          loader: () => data(),
          children: [
            {
              path: ':eventCategoryId',
              children: [
                { path: 'events/:eventId/runs/new', loader: newRunLoader, action: newRunAction, Component: NewRun },
                {
                  path: 'events/:eventId/runs/:runId',
                  action: deleteRunAction,
                  children: [{ path: 'edit', loader: editRunLoader, action: editRunAction, Component: EditRun }],
                },
                {
                  path: 'events/:eventId/runs/:runId/recorded',
                  action: ({ request }) => {
                    deletes.push({ method: request.method, path: new URL(request.url).pathname });
                    return null;
                  },
                },
                { path: '', Component: () => <div>Category page</div> },
              ],
            },
            { path: '', Component: () => <div>Event admin home</div> },
          ],
        },
      ],
      { apolloMocks, initialEntries: [path] },
    );
  };

  type Rendered = Awaited<ReturnType<typeof renderPage>>;

  const saveButton = (r: Rendered) => r.findByRole('button', { name: 'Save', hidden: true });

  describe('editing a run', () => {
    const path = '/admin_events/4/events/9/runs/33/edit';

    it('shows the run being edited, with its rooms and start time filled in', async () => {
      const r = await renderPage(path);

      expect(await r.findByText(/Edit run of Big Game/)).toBeTruthy();
      expect(r.getAllByText('Ballroom').length).toBeGreaterThan(0);
      expect(await saveButton(r)).toBeEnabled();
    });

    it('saves the changes and goes back to the category', async () => {
      const r = await renderPage(path);
      await user.type(await r.findByLabelText(/schedule note/i), 'Bring a snack');

      await user.click(await saveButton(r));

      expect(await r.findByText('Category page')).toBeTruthy();
      expect(mutations).toHaveBeenCalledTimes(1);
      const { input } = mutations.mock.calls[0][0];
      expect(input.id).toBe('33');
      expect(input.run).toMatchObject({
        starts_at: expect.stringContaining('2026-06-05'),
        schedule_note: 'Bring a snack',
        roomIds: ['2'],
      });
    });

    it('shows the error and stays on the form if saving fails', async () => {
      mutationError = 'Room is already booked';
      const r = await renderPage(path);
      await r.findByLabelText(/schedule note/i);

      await user.click(await saveButton(r));

      expect(await r.findByText(/Room is already booked/)).toBeTruthy();
      expect(r.queryByText('Category page')).toBeNull();
    });

    it('goes back without saving when cancelled', async () => {
      const r = await renderPage(path);
      await r.findByLabelText(/schedule note/i);

      const footer = (await saveButton(r)).closest('.modal-footer') as HTMLElement;
      await user.click(within(footer).getByRole('button', { name: 'Cancel', hidden: true }));

      expect(mutations).not.toHaveBeenCalled();
    });

    it('asks before deleting the run, then deletes it and returns to the category', async () => {
      const r = await renderPage(path);
      await r.findByLabelText(/schedule note/i);

      await user.click(r.getByRole('button', { name: 'Delete', hidden: true }));
      expect(await r.findByText(/Are you sure you want to delete this run of Big Game/)).toBeTruthy();
      expect(mutations).not.toHaveBeenCalled();
      await user.click(r.getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(mutations).toHaveBeenCalledWith({ input: { id: '33' } }));
      expect(await r.findByText('Category page')).toBeTruthy();
    });

    it('is a 404 for a run that does not exist', async () => {
      const r = await renderPage('/admin_events/4/events/9/runs/999/edit');

      await waitFor(() => expect(r.queryByText(/Edit run of/)).toBeNull());
    });
  });

  describe('adding a run', () => {
    const path = '/admin_events/4/events/9/runs/new';

    it('shows an empty run that cannot be saved without a start time', async () => {
      const r = await renderPage(path);

      expect(await r.findByText(/Add run of Big Game/)).toBeTruthy();
      expect(await saveButton(r)).toBeDisabled();
      expect(r.queryByRole('button', { name: 'Delete', hidden: true })).toBeNull();
    });

    it('is a 404 for an event that does not exist', async () => {
      const r = await renderPage('/admin_events/4/events/999/runs/new');

      await waitFor(() => expect(r.queryByText(/Add run of/)).toBeNull());
    });
  });
});
