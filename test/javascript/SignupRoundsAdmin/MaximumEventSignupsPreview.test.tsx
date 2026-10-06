import { render, userEvent } from '../testUtils';
import MaximumEventSignupsPreview from '../../../app/javascript/SignupRoundsAdmin/MaximumEventSignupsPreview';
import { SignupRoundsAdminQueryData } from '../../../app/javascript/SignupRoundsAdmin/queries.generated';

type Round = SignupRoundsAdminQueryData['convention']['signup_rounds'][number];

const round = (id: string, start: string | null, maximum: string): Round => ({
  __typename: 'SignupRound',
  id,
  start,
  maximum_event_signups: maximum,
  automation_action: 'none' as Round['automation_action'],
  ranked_choice_order: null,
  rerandomize_lottery_numbers: false,
  executed_at: null,
});

describe('MaximumEventSignupsPreview', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderPreview = (rounds: Round[]) =>
    render(<MaximumEventSignupsPreview signupRounds={rounds} timezoneName="UTC" />);

  // not yet until June 10, one signup from then until June 20, then unlimited
  const typicalRounds = () => [
    round('1', null, 'not_yet'),
    round('2', '2026-06-10T12:00:00Z', '1'),
    round('3', '2026-06-20T12:00:00Z', 'unlimited'),
  ];

  it('shows a calendar month for the range the changes cover', async () => {
    const { getAllByRole, getByText } = await renderPreview(typicalRounds());

    expect(getAllByRole('grid')).toHaveLength(1);
    expect(getByText('June 2026')).toBeTruthy();
  });

  it('shows a month for each month the changes span', async () => {
    const { getAllByRole, getByText } = await renderPreview([
      round('1', null, 'not_yet'),
      round('2', '2026-06-20T12:00:00Z', '2'),
      round('3', '2026-08-05T12:00:00Z', 'unlimited'),
    ]);

    expect(getAllByRole('grid')).toHaveLength(3);
    expect(getByText('July 2026')).toBeTruthy();
  });

  it('heads each column with its own weekday, starting with Sunday', async () => {
    const { getByRole } = await renderPreview(typicalRounds());

    const headerCells = Array.from(getByRole('grid').querySelectorAll('thead tr:nth-child(2) td'));
    const labels = headerCells.map((cell) => cell.textContent);
    expect(labels).toHaveLength(7);
    expect(labels).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });

  it('puts the first of the month under the right weekday', async () => {
    const { getByRole } = await renderPreview(typicalRounds());

    // June 1, 2026 is a Monday, so Sunday's cell in the first week is empty and Monday's is the 1st
    const firstWeek = getByRole('grid').querySelector('tbody tr') as HTMLElement;
    const cells = Array.from(firstWeek.querySelectorAll('td'));
    expect(cells[0].textContent).toBe('');
    expect(cells[1].textContent).toMatch(/^1/);
  });

  it('colours each day by what applies on it', async () => {
    const { getByRole } = await renderPreview(typicalRounds());

    const dayCell = (day: number) =>
      Array.from(getByRole('grid').querySelectorAll('tbody td')).find((cell) =>
        cell.textContent?.startsWith(`${day}`),
      )!;
    expect(dayCell(5).className).toContain('maximum-event-signups-not-yet');
    expect(dayCell(12).className).toContain('maximum-event-signups-1');
    expect(dayCell(25).className).toContain('maximum-event-signups-unlimited');
  });

  it('marks a day on which the value changes as a transition', async () => {
    const { getByRole } = await renderPreview(typicalRounds());

    const dayCell = (day: number) =>
      Array.from(getByRole('grid').querySelectorAll('tbody td')).find((cell) =>
        cell.textContent?.startsWith(`${day}`),
      )!;
    // (the value changes at noon on the 10th, so it's the 10th whose day ends with the new value in effect)
    expect(dayCell(10).className).toContain('transition');
    expect(dayCell(9).className).not.toContain('transition');
  });

  it('describes what applies on each day for assistive technology', async () => {
    const { getAllByText } = await renderPreview(typicalRounds());

    expect(getAllByText(/No signups yet/).length).toBeGreaterThan(0);
    expect(getAllByText(/Up to 1 event/).length).toBeGreaterThan(0);
    expect(getAllByText(/Signups fully open/).length).toBeGreaterThan(0);
  });

  it('shows a tooltip about a day when it is hovered over', async () => {
    const { getByRole, findAllByText } = await renderPreview(typicalRounds());
    const day = Array.from(getByRole('grid').querySelectorAll('tbody td div.cursor-pointer')).find((cell) =>
      cell.textContent?.startsWith('9'),
    )!;

    await user.hover(day);

    // (a day before a change says what happens at the change)
    expect((await findAllByText(/Wednesday, June 10|Tuesday, June 9/)).length).toBeGreaterThan(0);
  });

  it('cycles the colours for larger limits', async () => {
    const { getByRole } = await renderPreview([
      round('1', null, '7'),
      round('2', '2026-06-10T12:00:00Z', '10'),
      round('3', '2026-06-20T12:00:00Z', 'unlimited'),
    ]);

    const dayCell = (day: number) =>
      Array.from(getByRole('grid').querySelectorAll('tbody td')).find((cell) =>
        cell.textContent?.startsWith(`${day}`),
      )!;
    // 7 → 4, 10 → 4 again
    expect(dayCell(5).className).toContain('maximum-event-signups-4');
    expect(dayCell(12).className).toContain('maximum-event-signups-4');
  });

  it('says it is too long, instead of a calendar, for a range of more than six months', async () => {
    const { queryAllByRole, getByText } = await renderPreview([
      round('1', null, 'not_yet'),
      round('2', '2026-01-10T12:00:00Z', '1'),
      round('3', '2026-09-10T12:00:00Z', 'unlimited'),
    ]);

    expect(queryAllByRole('grid')).toHaveLength(0);
    expect(getByText(/too long/i)).toBeTruthy();
  });

  it('shows nothing when there is no range of dates to show', async () => {
    const none = await renderPreview([round('1', null, 'unlimited')]);
    expect(none.queryAllByRole('grid')).toHaveLength(0);
    none.unmount();

    const single = await renderPreview([round('1', null, 'not_yet'), round('2', '2026-06-10T12:00:00Z', 'unlimited')]);
    expect(single.queryAllByRole('grid')).toHaveLength(0);
  });
});
