import { data as routerData } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import ScheduleMultipleRunsModal from '../../../app/javascript/EventAdmin/ScheduleMultipleRunsModal';
import { buildAdminEvent, buildAdminRun, buildEventAdminEventsData } from '../fixtures/eventAdmin';

describe('ScheduleMultipleRunsModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: { method: string; path: string; body: { starts_at: string[]; room_id: string[] } }[];
  let actionResult: () => unknown;
  const onCancel = vi.fn();
  const onFinish = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
    actionResult = () => routerData({ ok: true });
    onCancel.mockReset();
    onFinish.mockReset();
    // (the schedule preview scrolls the prospective runs into view)
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // two hours long, with an existing run at 2pm on Friday
  const event = () =>
    buildAdminEvent({
      id: '9',
      title: 'Open Gaming',
      length_seconds: 2 * 3600,
      runs: [buildAdminRun({ id: '50', starts_at: '2026-06-05T14:00:00Z' })],
    });

  const renderModal = () => {
    const eventsData = buildEventAdminEventsData({ events: [event()] });
    return renderRoute(
      [
        {
          id: 'EventAdmin',
          path: '/admin_events',
          loader: () => eventsData,
          children: [
            {
              path: ':eventCategoryId/events/:eventId',
              Component: () => (
                <ScheduleMultipleRunsModal
                  convention={eventsData.convention}
                  event={event()}
                  visible
                  onCancel={onCancel}
                  onFinish={onFinish}
                />
              ),
              children: [
                {
                  path: 'runs/create_multiple',
                  action: async ({ request }) => {
                    submissions.push({
                      method: request.method,
                      path: new URL(request.url).pathname,
                      body: await request.json(),
                    });
                    return actionResult();
                  },
                },
              ],
            },
          ],
        },
      ],
      { initialEntries: ['/admin_events/4/events/9'], appRootContextValue: { timezoneName: 'UTC' } },
    );
  };

  type Rendered = Awaited<ReturnType<typeof renderModal>>;

  const scheduleButton = (r: Rendered) => r.getByRole('button', { name: 'Schedule runs', hidden: true });

  // react-select: open the menu by clicking the input, then pick the option
  const chooseRoom = async (r: Rendered, name: string) => {
    // (the select's id lands on its container rather than its input, so find the input from the label)
    const group = r.getByText('Room(s)').parentElement as HTMLElement;
    await user.click(within(group).getByRole('combobox'));
    await user.click(await r.findByRole('option', { name, hidden: true }));
  };

  // Friday noon to 4pm: two runs of two hours, but the 2pm-4pm one collides with the existing run
  const chooseFridayNoonToFour = async (r: Rendered, untilHour = '16') => {
    await user.click(await r.findByRole('radio', { name: 'Friday', hidden: true }));
    const [fromHour, untilHourSelect] = r.getAllByLabelText('Hour');
    const [fromMinute, untilMinute] = r.getAllByLabelText('Minute');
    await user.selectOptions(fromHour, '12');
    await user.selectOptions(untilHourSelect, untilHour);
    expect(fromMinute).toHaveValue('0');
    expect(untilMinute).toHaveValue('0');
  };

  it('names the event and cannot schedule anything until a time range is chosen', async () => {
    const r = await renderModal();

    expect(await r.findByText('Schedule runs of Open Gaming')).toBeTruthy();
    expect(scheduleButton(r)).toBeDisabled();
  });

  it('asks for the time range once a day is chosen', async () => {
    const r = await renderModal();
    expect(r.queryByText('From')).toBeNull();

    await user.click(await r.findByRole('radio', { name: 'Friday', hidden: true }));

    expect(r.getByText('From')).toBeTruthy();
    expect(r.getByText('Until')).toBeTruthy();
  });

  it('previews the runs that fit in the range, crossing out any that clash with an existing run', async () => {
    const r = await renderModal();

    await chooseFridayNoonToFour(r, '18');

    const preview = (await r.findByText('Will schedule runs at:')).closest('ul') as HTMLElement;
    const items = within(preview).getAllByRole('listitem').slice(1);
    expect(items.map((item) => item.textContent)).toEqual(['12:00pm', '2:00pm', '4:00pm']);
    // (the middle one overlaps the 2pm run already scheduled)
    expect(items.map((item) => item.querySelector('del') != null)).toEqual([false, true, false]);
  });

  it('schedules only the runs that do not clash, in the chosen rooms', async () => {
    const r = await renderModal();
    await chooseFridayNoonToFour(r, '18');
    await chooseRoom(r, 'Ballroom');
    await chooseRoom(r, 'Salon');

    await user.click(scheduleButton(r));

    await waitFor(() => expect(submissions).toHaveLength(1));
    expect(submissions[0].method).toBe('POST');
    expect(submissions[0].path).toBe('/admin_events/4/events/9/runs/create_multiple');
    expect(submissions[0].body.room_id).toEqual(['2', '3']);
    expect(submissions[0].body.starts_at.map((start) => start.slice(0, 16))).toEqual([
      '2026-06-05T12:00',
      '2026-06-05T16:00',
    ]);
  });

  it('cannot schedule when every run in the range clashes', async () => {
    const r = await renderModal();
    await user.click(await r.findByRole('radio', { name: 'Friday', hidden: true }));
    const [fromHour, untilHour] = r.getAllByLabelText('Hour');
    await user.selectOptions(fromHour, '14');
    await user.selectOptions(untilHour, '16');

    expect(await r.findByText('Will schedule runs at:')).toBeTruthy();
    expect(scheduleButton(r)).toBeDisabled();
  });

  it('finishes once the runs have been created', async () => {
    const r = await renderModal();
    await chooseFridayNoonToFour(r);

    await user.click(scheduleButton(r));

    await waitFor(() => expect(onFinish).toHaveBeenCalled());
  });

  it('does not finish, and shows the error, if creating the runs fails', async () => {
    actionResult = () => new Error('Room is already booked');
    const r = await renderModal();
    await chooseFridayNoonToFour(r);

    await user.click(scheduleButton(r));

    expect(await r.findByText(/Room is already booked/)).toBeTruthy();
    expect(onFinish).not.toHaveBeenCalled();
    expect(scheduleButton(r)).toBeEnabled();
  });

  it('can be cancelled', async () => {
    const r = await renderModal();

    const footer = scheduleButton(r).closest('.modal-footer') as HTMLElement;
    await user.click(within(footer).getByRole('button', { name: 'Cancel', hidden: true }));

    expect(onCancel).toHaveBeenCalled();
    expect(submissions).toEqual([]);
  });
});
