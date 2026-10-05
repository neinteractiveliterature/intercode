import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../../testUtils';
import UserSignupQueue from '../../../../app/javascript/EventsApp/MySignupQueue/UserSignupQueue';
import UserSignupQueueItem from '../../../../app/javascript/EventsApp/MySignupQueue/UserSignupQueueItem';
import {
  DeleteSignupRankedChoiceDocument,
  SetSignupRankedChoicePrioritizeWaitlistDocument,
  UpdateSignupRankedChoicePriorityDocument,
} from '../../../../app/javascript/EventsApp/MySignupQueue/mutations.generated';
import { RankedChoiceDecisionReason, SignupRankedChoiceState } from '../../../../app/javascript/graphqlTypes.generated';
import { buildQueueProfile, buildQueueRankedChoice, QueueProfile, QueueRankedChoice } from '../../fixtures/signupQueue';

const choiceFor = (id: string, priority: number, title: string, overrides: Partial<QueueRankedChoice> = {}) => {
  const base = buildQueueRankedChoice();
  return buildQueueRankedChoice({
    id,
    priority,
    target_run: {
      ...base.target_run,
      id: `run-${id}`,
      event: { ...base.target_run.event, id: `event-${id}`, title },
    },
    ...overrides,
  });
};

describe('the signup queue', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const sent = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    sent.mockReset();
  });

  const recordingMock = (
    query: MockLink.MockedResponse['request']['query'],
    data: Record<string, unknown>,
    options: Partial<MockLink.MockedResponse> = {},
  ): MockLink.MockedResponse => ({
    request: {
      query,
      variables: (variables: unknown) => {
        sent(variables);
        return true;
      },
    },
    result: { data },
    ...options,
  });

  const priorityMock = () =>
    recordingMock(UpdateSignupRankedChoicePriorityDocument, {
      __typename: 'Mutation',
      updateSignupRankedChoicePriority: {
        __typename: 'UpdateSignupRankedChoicePriorityPayload',
        clientMutationId: null,
      },
    });

  const threeChoices = () =>
    buildQueueProfile({
      signup_ranked_choices: [
        choiceFor('3', 3, 'Third Choice'),
        choiceFor('1', 1, 'First Choice'),
        choiceFor('2', 2, 'Second Choice'),
      ],
    });

  const renderItem = (
    profile: QueueProfile,
    index: number,
    { readOnly = false, apolloMocks = [] }: { readOnly?: boolean; apolloMocks?: MockLink.MockedResponse[] } = {},
  ) =>
    render(
      <ul>
        <UserSignupQueueItem
          userConProfile={profile}
          index={index}
          refetchQueries={[]}
          readOnly={readOnly}
          loading={false}
          enableDragDrop={false}
        />
      </ul>,
      { apolloMocks, appRootContextValue: { timezoneName: 'America/New_York' } },
    );

  describe('UserSignupQueue', () => {
    const renderQueue = (profile: QueueProfile, readOnly = false) =>
      render(<UserSignupQueue userConProfile={profile} refetchQueries={[]} readOnly={readOnly} />, {
        appRootContextValue: { timezoneName: 'America/New_York' },
      });

    it('lists the pending choices in priority order', async () => {
      const { getAllByRole } = await renderQueue(threeChoices());

      const titles = getAllByRole('link').map((link) => link.textContent);

      expect(titles).toEqual(['First Choice', 'Second Choice', 'Third Choice']);
    });

    it('leaves out choices that aren’t pending any more', async () => {
      const profile = buildQueueProfile({
        signup_ranked_choices: [
          choiceFor('1', 1, 'First Choice'),
          choiceFor('2', 2, 'Already Signed Up', { state: SignupRankedChoiceState.SignedUp }),
        ],
      });

      const { queryByText, getByText } = await renderQueue(profile);

      expect(getByText('First Choice')).toBeTruthy();
      expect(queryByText('Already Signed Up')).toBeNull();
    });

    it('has no drag handles until drag and drop is switched on', async () => {
      const { queryAllByText, getByRole } = await renderQueue(threeChoices());
      expect(queryAllByText('Drag to reorder')).toHaveLength(0);

      await user.click(getByRole('switch'));

      expect(queryAllByText('Drag to reorder')).toHaveLength(3);
    });

    it('shows no queue controls when read-only', async () => {
      const { queryByRole } = await renderQueue(threeChoices(), true);

      expect(queryByRole('button', { name: 'Move up in queue' })).toBeNull();
      expect(queryByRole('button', { name: 'Remove' })).toBeNull();
    });
  });

  describe('UserSignupQueueItem', () => {
    it('shows the event with its category, a link to it, the time, and the bucket asked for', async () => {
      const profile = buildQueueProfile({
        signup_ranked_choices: [choiceFor('1', 1, 'Big Game', { requested_bucket: null })],
      });

      const { container, getByRole } = await renderItem(profile, 0);

      expect(container).toHaveTextContent('Larp: Big Game');
      expect(getByRole('link', { name: 'Big Game' })).toHaveAttribute('href', '/events/event-1-big-game');
      expect(container).toHaveTextContent('Sat 4:00pm EDT');
      expect(container).toHaveTextContent('No preference');
    });

    it('shows a run’s title suffix', async () => {
      const base = choiceFor('1', 1, 'Big Game');
      const profile = buildQueueProfile({
        signup_ranked_choices: [{ ...base, target_run: { ...base.target_run, title_suffix: 'Saturday Night' } }],
      });

      const { container } = await renderItem(profile, 0);

      expect(container).toHaveTextContent('(Saturday Night)');
    });

    it('explains why a choice would be skipped', async () => {
      const profile = buildQueueProfile({
        signup_ranked_choices: [
          choiceFor('1', 1, 'Big Game', {
            simulated_skip_reason: {
              __typename: 'SimulatedSkipReason',
              reason: RankedChoiceDecisionReason.WaitlistPositionCapExceeded,
              extra: { waitlist_position: 6, waitlist_position_cap: 3 },
            },
          }),
        ],
      });

      const { container } = await renderItem(profile, 0);

      expect(container).toHaveTextContent('which exceeds your cap of 3');
    });

    describe('moving a choice', () => {
      it('can’t move the first up or the last down', async () => {
        const first = await renderItem(threeChoices(), 0);
        expect(first.getByRole('button', { name: 'Move up in queue' })).toBeDisabled();
        expect(first.getByRole('button', { name: 'Move down in queue' })).toBeEnabled();
        first.unmount();

        const last = await renderItem(threeChoices(), 2);
        expect(last.getByRole('button', { name: 'Move up in queue' })).toBeEnabled();
        expect(last.getByRole('button', { name: 'Move down in queue' })).toBeDisabled();
      });

      it('asks for a priority one higher when moved down, and one lower when moved up', async () => {
        const down = await renderItem(threeChoices(), 1, { apolloMocks: [priorityMock()] });
        await user.click(down.getByRole('button', { name: 'Move down in queue' }));
        await waitFor(() => expect(sent).toHaveBeenCalledWith({ id: '2', priority: 3 }));
        down.unmount();

        const up = await renderItem(threeChoices(), 1, { apolloMocks: [priorityMock()] });
        await user.click(up.getByRole('button', { name: 'Move up in queue' }));
        await waitFor(() => expect(sent).toHaveBeenCalledWith({ id: '2', priority: 1 }));
      });
    });

    describe('removing a choice', () => {
      const deleteMock = () =>
        recordingMock(DeleteSignupRankedChoiceDocument, {
          __typename: 'Mutation',
          deleteSignupRankedChoice: { __typename: 'DeleteSignupRankedChoicePayload', clientMutationId: null },
        });

      it('asks first, naming the event, then removes it', async () => {
        const { getByRole, findByText } = await renderItem(threeChoices(), 0, { apolloMocks: [deleteMock()] });

        await user.click(getByRole('button', { name: 'Remove' }));
        const prompt = await findByText(/remove First Choice from your signup queue/);
        expect(sent).not.toHaveBeenCalled();
        // (the advanced menu has an OK button too, so use the one in the confirmation)
        await user.click(
          within(prompt.closest('.modal-content') as HTMLElement).getByRole('button', { name: 'OK', hidden: true }),
        );

        await waitFor(() => expect(sent).toHaveBeenCalledWith({ id: '1' }));
      });

      it('keeps it if the confirmation is cancelled', async () => {
        const { getByRole, findByText, queryByText } = await renderItem(threeChoices(), 0, {
          apolloMocks: [deleteMock()],
        });

        await user.click(getByRole('button', { name: 'Remove' }));
        const prompt = await findByText(/remove First Choice from your signup queue/);
        await user.click(
          within(prompt.closest('.modal-content') as HTMLElement).getByRole('button', { name: 'Cancel', hidden: true }),
        );

        await waitFor(() => expect(queryByText(/remove First Choice/)).toBeNull());
        expect(sent).not.toHaveBeenCalled();
      });
    });

    describe('read-only', () => {
      it('has no move or remove buttons', async () => {
        const { queryByRole } = await renderItem(threeChoices(), 1, { readOnly: true });

        expect(queryByRole('button', { name: 'Move up in queue' })).toBeNull();
        expect(queryByRole('button', { name: 'Move down in queue' })).toBeNull();
        expect(queryByRole('button', { name: 'Remove' })).toBeNull();
      });
    });

    describe('the advanced menu', () => {
      const prioritizeMock = (prioritizeWaitlist: boolean, cap: number | null) =>
        recordingMock(SetSignupRankedChoicePrioritizeWaitlistDocument, {
          __typename: 'Mutation',
          setSignupRankedChoicePrioritzeWaitlist: {
            __typename: 'SetSignupRankedChoicePrioritzeWaitlistPayload',
            clientMutationId: null,
            signup_ranked_choice: {
              __typename: 'SignupRankedChoice',
              id: '1',
              prioritize_waitlist: prioritizeWaitlist,
              waitlist_position_cap: cap,
            },
          },
        });

      const openMenu = async (result: Awaited<ReturnType<typeof renderItem>>) => {
        await user.click(result.getByRole('button', { name: /Advanced/ }));
      };

      it('saves a choice to prioritise the waitlist, and confirms what that means', async () => {
        const result = await renderItem(threeChoices(), 0, { apolloMocks: [prioritizeMock(true, null)] });

        await openMenu(result);
        await user.click(result.getByRole('checkbox', { name: 'If full, waitlist instead of skipping' }));
        await user.click(result.getByRole('button', { name: 'OK' }));

        await waitFor(() =>
          expect(sent).toHaveBeenCalledWith({ id: '1', prioritizeWaitlist: true, waitlistPositionCap: null }),
        );
        await waitFor(() =>
          expect(result.container).toHaveTextContent(
            'we’ll put you on the waitlist for it rather than trying to sign you up for Second Choice',
          ),
        );
      });

      it('lets a position cap be chosen, and sends it', async () => {
        const result = await renderItem(threeChoices(), 0, { apolloMocks: [prioritizeMock(true, 4)] });

        await openMenu(result);
        await user.click(result.getByRole('checkbox', { name: 'If full, waitlist instead of skipping' }));
        await user.selectOptions(result.getByRole('combobox'), '4');
        await user.click(result.getByRole('button', { name: 'OK' }));

        await waitFor(() =>
          expect(sent).toHaveBeenCalledWith({ id: '1', prioritizeWaitlist: true, waitlistPositionCap: 4 }),
        );
      });

      it('only offers the position cap once the waitlist is prioritised', async () => {
        const result = await renderItem(threeChoices(), 0);

        await openMenu(result);
        expect(result.queryByRole('combobox')).toBeNull();
        await user.click(result.getByRole('checkbox', { name: 'If full, waitlist instead of skipping' }));

        expect(result.getByRole('combobox')).toBeTruthy();
      });

      it('throws away unsaved changes when cancelled', async () => {
        const result = await renderItem(threeChoices(), 0);

        await openMenu(result);
        const checkbox = result.getByRole('checkbox', { name: 'If full, waitlist instead of skipping' });
        await user.click(checkbox);
        await user.click(result.getByRole('button', { name: 'Cancel' }));
        await openMenu(result);

        expect(result.getByRole('checkbox', { name: 'If full, waitlist instead of skipping' })).not.toBeChecked();
        expect(sent).not.toHaveBeenCalled();
      });
    });
  });
});
