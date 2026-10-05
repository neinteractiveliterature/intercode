import { data } from 'react-router';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import EventProposalStatusUpdater from '../../../app/javascript/EventProposals/EventProposalStatusUpdater';
import { EventProposalQueryWithOwnerQueryData } from '../../../app/javascript/EventProposals/queries.generated';

type Proposal = EventProposalQueryWithOwnerQueryData['convention']['event_proposal'];

describe('EventProposalStatusUpdater', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: { method: string; path: string; body: Record<string, string> }[];
  let actionResult: () => unknown;

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
    actionResult = () => data({ ok: true });
  });

  const proposal = (overrides: Partial<Pick<Proposal, 'status' | 'event' | 'title'>> = {}) =>
    ({ id: '20', title: 'My Big Game', status: 'proposed', event: null, ...overrides }) as Proposal;

  const renderUpdater = (eventProposal: Proposal) =>
    renderRoute(
      [
        { path: '/', Component: () => <EventProposalStatusUpdater eventProposal={eventProposal} /> },
        {
          path: '/event_proposals/:id/transition',
          action: async ({ request }) => {
            const formData = await request.formData();
            submissions.push({
              method: request.method,
              path: new URL(request.url).pathname,
              body: Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)])),
            });
            return actionResult();
          },
        },
      ],
      { initialEntries: ['/'] },
    );

  const openModal = async (r: Awaited<ReturnType<typeof renderUpdater>>) => {
    await user.click(await r.findByRole('button', { name: 'Change' }));
    return r.findByRole('radio', { name: 'Reviewing', hidden: true });
  };

  const chooseStatus = (r: Awaited<ReturnType<typeof renderUpdater>>, name: string) =>
    user.click(r.getByRole('radio', { name, hidden: true }));

  // (the dialog stays in the page when closed, just hidden from assistive technology)
  const dialog = (r: Awaited<ReturnType<typeof renderUpdater>>) =>
    r.getByRole('radio', { name: 'Reviewing', hidden: true }).closest('.modal') as HTMLElement;

  const submitButton = (r: Awaited<ReturnType<typeof renderUpdater>>, name: string) =>
    r.getByRole('button', { name, hidden: true });

  it('shows the current status in words', async () => {
    const { findByText } = await renderUpdater(proposal({ status: 'tentative_accept' }));

    expect((await findByText('Status:')).parentElement?.textContent).toContain('Tentative accept');
  });

  it('opens a dialog for the proposal, with the current status chosen', async () => {
    const r = await renderUpdater(proposal({ status: 'reviewing' }));

    await openModal(r);

    expect(r.getByText(/Change status for/, { ignore: 'script' })).toBeTruthy();
    expect(r.getByRole('radio', { name: 'Reviewing', hidden: true })).toBeChecked();
  });

  it('cannot submit until the status has been changed', async () => {
    const r = await renderUpdater(proposal({ status: 'proposed' }));
    await openModal(r);

    expect(submitButton(r, 'Update')).toBeDisabled();

    await chooseStatus(r, 'Reviewing');
    expect(submitButton(r, 'Update')).toBeEnabled();
  });

  it.each([
    ['Tentative accept', 'Accept tentatively'],
    ['Accepted', 'Accept'],
    ['Rejected', 'Reject'],
    ['Reviewing', 'Update'],
  ])('labels the button for %s as "%s"', async (statusName, buttonLabel) => {
    const r = await renderUpdater(proposal({ status: 'proposed' }));
    await openModal(r);

    await chooseStatus(r, statusName);

    expect(submitButton(r, buttonLabel)).toBeTruthy();
  });

  it('warns that accepting will create an event, if there is not one yet', async () => {
    const r = await renderUpdater(proposal());
    await openModal(r);

    await chooseStatus(r, 'Accepted');

    expect(r.getByText(/This will create an event on the convention web site/)).toBeTruthy();
  });

  it('does not warn if there already is an event', async () => {
    const r = await renderUpdater(proposal({ event: { __typename: 'Event', id: '3' } }));
    await openModal(r);

    await chooseStatus(r, 'Accepted');

    expect(r.queryByText(/This will create an event/)).toBeNull();
  });

  describe('dropping the event', () => {
    it('is offered when rejecting or withdrawing a proposal that has an event', async () => {
      const r = await renderUpdater(proposal({ event: { __typename: 'Event', id: '3' } }));
      await openModal(r);

      expect(r.queryByText('Drop event?')).toBeNull();
      await chooseStatus(r, 'Rejected');
      expect(r.getByText('Drop event?')).toBeTruthy();
      await chooseStatus(r, 'Withdrawn');
      expect(r.getByText('Drop event?')).toBeTruthy();
    });

    it('is not offered without an event', async () => {
      const r = await renderUpdater(proposal());
      await openModal(r);

      await chooseStatus(r, 'Rejected');

      expect(r.queryByText('Drop event?')).toBeNull();
    });

    it('is sent along when chosen', async () => {
      const r = await renderUpdater(proposal({ event: { __typename: 'Event', id: '3' } }));
      await openModal(r);
      await chooseStatus(r, 'Rejected');

      await user.click(r.getByRole('radio', { name: 'Yes', hidden: true }));
      await user.click(submitButton(r, 'Reject'));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0].body).toEqual({ status: 'rejected', drop_event: 'true' });
    });

    it('is forgotten when the status is changed again', async () => {
      const r = await renderUpdater(proposal({ event: { __typename: 'Event', id: '3' } }));
      await openModal(r);
      await chooseStatus(r, 'Rejected');
      await user.click(r.getByRole('radio', { name: 'Yes', hidden: true }));

      await chooseStatus(r, 'Withdrawn');

      expect(r.getByRole('radio', { name: 'No', hidden: true })).toBeChecked();
    });
  });

  it('submits the new status to the proposal’s transition route and closes the dialog', async () => {
    const r = await renderUpdater(proposal());
    await openModal(r);

    await chooseStatus(r, 'Accepted');
    await user.click(submitButton(r, 'Accept'));

    await waitFor(() => expect(submissions).toHaveLength(1));
    expect(submissions[0]).toMatchObject({
      method: 'PATCH',
      path: '/event_proposals/20/transition',
      body: { status: 'accepted' },
    });
    await waitFor(() => expect(dialog(r).getAttribute('aria-hidden')).toBe('true'));
  });

  it('shows the error and keeps the dialog open if the transition fails', async () => {
    actionResult = () => new Error('Proposal is missing required fields');
    const r = await renderUpdater(proposal());
    await openModal(r);

    await chooseStatus(r, 'Accepted');
    await user.click(submitButton(r, 'Accept'));

    expect(await r.findByText(/Proposal is missing required fields/)).toBeTruthy();
    expect(dialog(r).getAttribute('aria-hidden')).toBe('false');
  });

  it('closes the dialog without submitting when cancelled', async () => {
    const r = await renderUpdater(proposal());
    await openModal(r);

    await user.click(within(dialog(r)).getByRole('button', { name: 'Cancel', hidden: true }));

    await waitFor(() => expect(dialog(r).getAttribute('aria-hidden')).toBe('true'));
    expect(submissions).toEqual([]);
  });
});
