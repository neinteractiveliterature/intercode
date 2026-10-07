import { GraphQLError } from 'graphql';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as EditEventProposal, loader } from '../../../app/javascript/EventProposals/EditEventProposal';
import {
  EventProposalQueryData,
  EventProposalQueryDocument,
} from '../../../app/javascript/EventProposals/queries.generated';
import {
  SubmitEventProposalDocument,
  UpdateEventProposalDocument,
} from '../../../app/javascript/EventProposals/mutations.generated';
import { buildEventProposalFields, buildEventProposalQueryData } from '../fixtures/eventProposals';

describe('EditEventProposal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const updates = vi.fn();
  const submits = vi.fn();
  let deletes: { method: string; path: string }[];
  let submitError: Error | undefined;
  let updateError: Error | undefined;
  let updateDelay: number | undefined;

  beforeEach(() => {
    user = userEvent.setup();
    updates.mockReset();
    submits.mockReset();
    deletes = [];
    submitError = undefined;
    updateError = undefined;
    updateDelay = undefined;
  });

  const proposalResult = () => buildEventProposalFields();

  const buildMocks = (queryData: EventProposalQueryData): MockLink.MockedResponse[] => [
    {
      request: { query: EventProposalQueryDocument, variables: { eventProposalId: '20' } },
      result: { data: queryData },
      maxUsageCount: 20,
    },
    {
      request: {
        query: UpdateEventProposalDocument,
        variables: (variables: unknown) => {
          updates(variables);
          return true;
        },
      },
      result: () =>
        updateError
          ? { errors: [new GraphQLError(updateError.message, { path: ['updateEventProposal'] })] }
          : {
              data: {
                updateEventProposal: { __typename: 'UpdateEventProposalPayload', event_proposal: proposalResult() },
              },
            },
      delay: updateDelay,
      maxUsageCount: 50,
    },
    {
      request: {
        query: SubmitEventProposalDocument,
        variables: (variables: unknown) => {
          submits(variables);
          return true;
        },
      },
      result: () =>
        submitError
          ? { errors: [new GraphQLError(submitError.message, { path: ['submitEventProposal'] })] }
          : {
              data: {
                submitEventProposal: { __typename: 'SubmitEventProposalPayload', event_proposal: proposalResult() },
              },
            },
      maxUsageCount: 5,
    },
  ];

  const renderPage = (queryData: EventProposalQueryData = buildEventProposalQueryData()) =>
    renderRoute(
      [
        { path: '/event_proposals/:id/edit', loader, Component: EditEventProposal },
        {
          path: '/event_proposals/:id',
          action: ({ request }) => {
            deletes.push({ method: request.method, path: new URL(request.url).pathname });
            return null;
          },
        },
        { path: '/pages/new-proposal', Component: () => <div>New proposal page</div> },
        { path: '/events/:id/edit', Component: () => <div>Edit event page</div> },
      ],
      { apolloMocks: buildMocks(queryData), initialEntries: ['/event_proposals/20/edit'] },
    );

  it('shows the proposal form with the saved answers', async () => {
    const { findByLabelText } = await renderPage();

    expect(((await findByLabelText('Title', { selector: 'input' })) as HTMLInputElement).value).toBe('My Big Game');
  });

  it('sends changed answers to be saved', async () => {
    const { findByLabelText } = await renderPage();
    const title = await findByLabelText('Title', { selector: 'input' });

    await user.type(title, '!');

    await waitFor(() =>
      expect(updates).toHaveBeenCalledWith({
        input: { id: '20', event_proposal: { form_response_attrs_json: JSON.stringify({ title: 'My Big Game!' }) } },
      }),
    );
  });

  it('submits the proposal and goes to the new-proposal page', async () => {
    const { findByRole, findByText } = await renderPage();

    await user.click(await findByRole('button', { name: 'Submit proposal' }));

    expect(await findByText('New proposal page')).toBeTruthy();
    expect(submits).toHaveBeenCalledWith({ input: { id: '20' } });
  });

  it('stays on the form and shows the error if submitting fails', async () => {
    submitError = new Error('Proposal is not complete');
    const { findByRole, findByText, queryByText } = await renderPage();

    await user.click(await findByRole('button', { name: 'Submit proposal' }));

    expect(await findByText(/Proposal is not complete/)).toBeTruthy();
    expect(queryByText('New proposal page')).toBeNull();
  });

  // (the form saves when it loads, so this is clicking while that first save is still in flight)
  it('waits for a save that is in flight rather than submitting over it', async () => {
    const { findByRole, findByText } = await renderPage();

    await user.click(await findByRole('button', { name: 'Submit proposal' }));

    expect(await findByText('New proposal page')).toBeTruthy();
    expect(updates).toHaveBeenCalled();
    expect(submits).toHaveBeenCalledTimes(1);
  });

  it('does not submit, and shows the error, if the save before it failed', async () => {
    updateError = new Error('Title is too long');
    // (slow enough that the save is certainly still in flight when Submit is clicked, rather than racing it)
    updateDelay = 300;
    const { findByRole, findByText, queryByText } = await renderPage();
    const submitButton = await findByRole('button', { name: 'Submit proposal' });
    await waitFor(() => expect(updates).toHaveBeenCalled());

    await user.click(submitButton);

    expect(await findByText(/Title is too long/)).toBeTruthy();
    expect(submits).not.toHaveBeenCalled();
    expect(queryByText('New proposal page')).toBeNull();
  });

  it('links back to the proposals page', async () => {
    const { findByRole } = await renderPage();

    expect(
      ((await findByRole('link', { name: 'Return to proposals page' })) as HTMLAnchorElement).getAttribute('href'),
    ).toBe('/pages/new-proposal');
  });

  it('goes to the event’s edit page instead, once the proposal has become an event', async () => {
    const { findByText } = await renderPage(buildEventProposalQueryData({ event: { __typename: 'Event', id: '3' } }));

    expect(await findByText('Edit event page')).toBeTruthy();
  });

  describe('deleting', () => {
    it('is not offered without permission', async () => {
      const { findByLabelText, queryByRole } = await renderPage();
      await findByLabelText('Title', { selector: 'input' });

      expect(queryByRole('button', { name: 'Delete proposal' })).toBeNull();
    });

    it('asks first, then deletes and goes to the new-proposal page', async () => {
      const { findAllByRole, getByRole, findByText } = await renderPage(
        buildEventProposalQueryData({}, { canDelete: true }),
      );

      // (the button is rendered twice, once per screen size)
      await user.click((await findAllByRole('button', { name: 'Delete proposal' }))[0]);
      expect(await findByText(/This will erase your proposal/)).toBeTruthy();
      expect(deletes).toEqual([]);
      await user.click(getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(deletes).toHaveLength(1));
      expect(deletes[0]).toEqual({ method: 'DELETE', path: '/event_proposals/20' });
    });
  });
});
