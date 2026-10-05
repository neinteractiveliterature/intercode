import { useState } from 'react';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import {
  useWithdrawMySignupModal,
  WithdrawMySignupModal,
  WithdrawMySignupModalProps,
} from '../../../app/javascript/EventsApp/EventPage/WithdrawMySignupModal';
import { WithdrawMySignupDocument } from '../../../app/javascript/EventsApp/EventPage/mutations.generated';
import { SignupAutomationMode, SignupMode, SignupState } from '../../../app/javascript/graphqlTypes.generated';

describe('WithdrawMySignupModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const close = vi.fn();
  const withdrawn = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    close.mockReset();
    withdrawn.mockReset();
  });

  const withdrawMock = (options: Partial<MockLink.MockedResponse> = {}): MockLink.MockedResponse => ({
    request: {
      query: WithdrawMySignupDocument,
      variables: (variables: unknown) => {
        withdrawn(variables);
        return true;
      },
    },
    result: { data: { withdrawMySignup: { __typename: 'WithdrawMySignupPayload', signup: null } } },
    // (the modal resets the store afterwards, which makes any active query refetch)
    ...options,
  });

  const props = (overrides: Partial<WithdrawMySignupModalProps> = {}): WithdrawMySignupModalProps => ({
    close,
    event: { title: 'Big Game' },
    run: { id: '20' },
    signup: { id: '90', state: SignupState.Confirmed, counted: true },
    signupRounds: [],
    ...overrides,
  });

  const renderModal = (
    modalProps: WithdrawMySignupModalProps,
    context: Parameters<typeof render>[1] = {},
    apolloMocks: MockLink.MockedResponse[] = [],
  ) =>
    render(<WithdrawMySignupModal {...modalProps} />, {
      apolloMocks,
      appRootContextValue: { signupMode: SignupMode.SelfService, ...context.appRootContextValue },
    });

  // (the test wrapper's confirm dialog has buttons of its own, so look within this modal's footer)
  const footerButton = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
    within(
      result.getByText('Are you sure?').closest('.modal-content')?.querySelector('.modal-footer') as HTMLElement,
    ).getByRole('button', { name, hidden: true });

  describe('what it asks', () => {
    it('asks a plain question in a self-service convention', async () => {
      const { getByText } = await renderModal(
        props({ signup: { id: '90', state: SignupState.Waitlisted, counted: true } }),
      );

      expect(getByText('Are you sure you want to withdraw from Big Game?')).toBeTruthy();
    });

    it('warns that it won’t free up a slot when the signup isn’t counted', async () => {
      const { getByText } = await renderModal(
        props({ signup: { id: '90', state: SignupState.Confirmed, counted: false } }),
      );

      expect(getByText(/This event does not count towards your signup totals/)).toBeTruthy();
    });

    it('tells people in a moderated convention to request the other event instead', async () => {
      const { getByText } = await renderModal(props(), { appRootContextValue: { signupMode: SignupMode.Moderated } });

      expect(getByText(/please go to that event’s page and request to sign up for it/)).toBeTruthy();
    });

    it('says a slot will be freed up during a ranked-choice signup round with a signup limit', async () => {
      const { getByText } = await renderModal(
        props({ signupRounds: [{ start: '2020-01-01T00:00:00Z', maximum_event_signups: '3' }] }),
        { appRootContextValue: { signupAutomationMode: SignupAutomationMode.RankedChoice } },
      );

      expect(getByText(/you’ll have an available signup slot/)).toBeTruthy();
    });

    it('does not say that when the round has no limit', async () => {
      const { queryByText } = await renderModal(
        props({ signupRounds: [{ start: '2020-01-01T00:00:00Z', maximum_event_signups: 'unlimited' }] }),
        { appRootContextValue: { signupAutomationMode: SignupAutomationMode.RankedChoice } },
      );

      expect(queryByText(/you’ll have an available signup slot/)).toBeNull();
    });

    it('does not say it when it’s not a ranked-choice convention', async () => {
      const { queryByText } = await renderModal(
        props({ signupRounds: [{ start: '2020-01-01T00:00:00Z', maximum_event_signups: '3' }] }),
        { appRootContextValue: { signupAutomationMode: SignupAutomationMode.None } },
      );

      expect(queryByText(/you’ll have an available signup slot/)).toBeNull();
    });
  });

  describe('the confirmation checkbox', () => {
    it('is required to withdraw a confirmed signup', async () => {
      const result = await renderModal(props(), {}, [withdrawMock()]);

      expect(footerButton(result, 'Confirm')).toBeDisabled();
      await user.click(result.getByRole('checkbox', { hidden: true }));
      expect(footerButton(result, 'Confirm')).toBeEnabled();
      await user.click(result.getByRole('checkbox', { hidden: true }));
      expect(footerButton(result, 'Confirm')).toBeDisabled();
    });

    it('is not needed for a waitlisted signup', async () => {
      const result = await renderModal(props({ signup: { id: '90', state: SignupState.Waitlisted, counted: true } }));

      expect(result.queryByRole('checkbox', { hidden: true })).toBeNull();
      expect(footerButton(result, 'Confirm')).toBeEnabled();
    });
  });

  describe('withdrawing', () => {
    it('withdraws from the run, then closes', async () => {
      const result = await renderModal(props(), {}, [withdrawMock()]);

      await user.click(result.getByRole('checkbox', { hidden: true }));
      await user.click(footerButton(result, 'Confirm'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(withdrawn).toHaveBeenCalledWith({ runId: '20' });
    });

    it('shows the error, and can be tried again, if the withdrawal fails', async () => {
      const result = await renderModal(
        props({ signup: { id: '90', state: SignupState.Waitlisted, counted: true } }),
        {},
        [withdrawMock({ result: { errors: [{ message: 'Signup round is closed' }] } })],
      );

      await user.click(footerButton(result, 'Confirm'));

      expect(await result.findByText(/Signup round is closed/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
      expect(footerButton(result, 'Confirm')).toBeEnabled();
      expect(footerButton(result, 'Cancel')).toBeEnabled();
    });

    it('disables both buttons while the withdrawal is in progress', async () => {
      const result = await renderModal(
        props({ signup: { id: '90', state: SignupState.Waitlisted, counted: true } }),
        {},
        [withdrawMock({ delay: 100 })],
      );

      await user.click(footerButton(result, 'Confirm'));

      await waitFor(() => expect(footerButton(result, 'Confirm')).toBeDisabled());
      expect(footerButton(result, 'Cancel')).toBeDisabled();
      await waitFor(() => expect(close).toHaveBeenCalled());
    });

    it('closes without withdrawing when cancelled', async () => {
      const result = await renderModal(props(), {}, [withdrawMock()]);

      await user.click(footerButton(result, 'Cancel'));

      expect(close).toHaveBeenCalledTimes(1);
      expect(withdrawn).not.toHaveBeenCalled();
    });
  });

  describe('useWithdrawMySignupModal', () => {
    function Opener() {
      const modal = useWithdrawMySignupModal();
      const [counter, setCounter] = useState(0);
      const { close: _close, ...modalProps } = props();
      void _close;

      return (
        <>
          <button type="button" onClick={() => modal.openModal(modalProps)}>
            Open
          </button>
          <button type="button" onClick={() => setCounter((prev) => prev + 1)}>
            Re-render {counter}
          </button>
          {modal.modal}
        </>
      );
    }

    it('shows nothing until it is opened, then shows the modal, and closes it again on cancel', async () => {
      const { getByRole, queryByText, findByText } = await render(<Opener />);
      expect(queryByText('Are you sure?')).toBeNull();

      await user.click(getByRole('button', { name: 'Open' }));
      expect(await findByText('Are you sure?')).toBeTruthy();

      const footer = (await findByText('Are you sure?'))
        .closest('.modal-content')
        ?.querySelector('.modal-footer') as HTMLElement;
      await user.click(within(footer).getByRole('button', { name: 'Cancel', hidden: true }));
      await waitFor(() => expect(queryByText('Are you sure?')).toBeNull());
    });

    it('keeps what the person has ticked when the page around it re-renders', async () => {
      const { getByRole, findByRole } = await render(<Opener />);

      await user.click(getByRole('button', { name: 'Open' }));
      await user.click(await findByRole('checkbox', { hidden: true }));
      await user.click(getByRole('button', { name: /Re-render/ }));

      expect(await findByRole('checkbox', { hidden: true })).toBeChecked();
    });
  });
});
