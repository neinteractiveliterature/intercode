import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import CreateModeratedSignupModal, {
  CreateModeratedSignupModalProps,
} from '../../../app/javascript/EventsApp/EventPage/CreateModeratedSignupModal';
import {
  CreateModeratedSignupModalQueryData,
  CreateModeratedSignupModalQueryDocument,
} from '../../../app/javascript/EventsApp/EventPage/queries.generated';
import {
  CreateSignupRankedChoiceDocument,
  CreateSignupRankedChoiceMutationData,
  CreateSignupRankedChoiceMutationVariables,
  CreateSignupRequestDocument,
  CreateSignupRequestMutationData,
  CreateSignupRequestMutationVariables,
} from '../../../app/javascript/EventsApp/EventPage/mutations.generated';
import { SignupRankedChoiceState, SignupRequestState } from '../../../app/javascript/graphqlTypes.generated';
import { SignupOption } from '../../../app/javascript/EventsApp/EventPage/buildSignupOptions';

type MySignup = NonNullable<
  NonNullable<CreateModeratedSignupModalQueryData['convention']['my_profile']>['signups']
>[number];

const event = { id: '10', length_seconds: 4 * 60 * 60, can_play_concurrently: false };
// 4pm to 8pm UTC on Friday
const run = { id: '20', starts_at: '2026-06-05T16:00:00Z' };

const bucket: NonNullable<SignupOption['bucket']> = {
  __typename: 'RegistrationPolicyBucket',
  id: '1',
  key: 'unlimited',
  name: 'Unlimited',
  description: null,
  not_counted: false,
  slots_limited: false,
  anything: false,
  minimum_slots: null,
  total_slots: null,
};

const signupOption = (overrides: Partial<SignupOption> = {}): SignupOption => ({
  key: 'unlimited',
  bucket,
  buttonClass: 'btn-primary',
  noPreference: false,
  counted: true,
  teamMember: false,
  action: 'SIGN_UP_NOW',
  pendingRankedChoices: [],
  ...overrides,
});

const buildSignup = (
  overrides: { id?: string; startsAt?: string; title?: string; canPlayConcurrently?: boolean } & Partial<MySignup> = {},
): MySignup => {
  const {
    id = '90',
    startsAt = '2026-06-05T18:00:00Z',
    title = 'Conflicting Game',
    canPlayConcurrently = false,
    ...rest
  } = overrides;
  return {
    __typename: 'Signup',
    id,
    state: 'confirmed' as MySignup['state'],
    run: {
      __typename: 'Run',
      id: '91',
      starts_at: startsAt,
      event: {
        __typename: 'Event',
        id: '92',
        title,
        length_seconds: 2 * 60 * 60,
        can_play_concurrently: canPlayConcurrently,
      },
    },
    ...rest,
  };
};

describe('CreateModeratedSignupModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const close = vi.fn();
  const requested = vi.fn<(variables: CreateSignupRequestMutationVariables) => void>();
  const rankedChoiceRequested = vi.fn<(variables: CreateSignupRankedChoiceMutationVariables) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    close.mockReset();
    requested.mockReset();
    rankedChoiceRequested.mockReset();
  });

  const queryMock = (signups: MySignup[]): MockLink.MockedResponse<CreateModeratedSignupModalQueryData> => ({
    request: { query: CreateModeratedSignupModalQueryDocument },
    result: {
      data: {
        __typename: 'Query',
        convention: {
          __typename: 'Convention',
          id: '1',
          my_profile: { __typename: 'UserConProfile', id: '1', signups },
        },
      },
    },
    // (the modal resets the store when it's done, which fetches the query again)
    maxUsageCount: 5,
  });

  const createRequestMock = (
    options: Partial<
      MockLink.MockedResponse<CreateSignupRequestMutationData, CreateSignupRequestMutationVariables>
    > = {},
  ): MockLink.MockedResponse<CreateSignupRequestMutationData, CreateSignupRequestMutationVariables> => ({
    request: {
      query: CreateSignupRequestDocument,
      variables: (variables) => {
        requested(variables);
        return true;
      },
    },
    result: {
      data: {
        __typename: 'Mutation',
        createSignupRequest: {
          __typename: 'CreateSignupRequestPayload',
          signup_request: {
            __typename: 'SignupRequest',
            id: '300',
            state: SignupRequestState.Pending,
            target_run: { __typename: 'Run', id: '20' },
            requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
            replace_signup: null,
          },
        },
      },
    },
    ...options,
  });

  const createRankedChoiceMock = (
    options: Partial<
      MockLink.MockedResponse<CreateSignupRankedChoiceMutationData, CreateSignupRankedChoiceMutationVariables>
    > = {},
  ): MockLink.MockedResponse<CreateSignupRankedChoiceMutationData, CreateSignupRankedChoiceMutationVariables> => ({
    request: {
      query: CreateSignupRankedChoiceDocument,
      variables: (variables) => {
        rankedChoiceRequested(variables);
        return true;
      },
    },
    result: {
      data: {
        __typename: 'Mutation',
        createSignupRankedChoice: {
          __typename: 'CreateSignupRankedChoicePayload',
          signup_ranked_choice: {
            __typename: 'SignupRankedChoice',
            id: '400',
            state: SignupRankedChoiceState.Pending,
            priority: 1,
            target_run: { __typename: 'Run', id: '20' },
            requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
          },
        },
      },
    },
    ...options,
  });

  const renderModal = (apolloMocks: MockLink.MockedResponse[], props: Partial<CreateModeratedSignupModalProps> = {}) =>
    render(
      <CreateModeratedSignupModal
        visible
        close={close}
        run={run}
        event={event}
        signupOption={signupOption()}
        {...props}
      />,
      { apolloMocks, appRootContextValue: { conventionName: 'Test Con', timezoneName: 'America/New_York' } },
    );

  // (the test wrapper's confirm dialog has buttons of its own, so look within this modal's footer)
  const footerButton = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
    within(
      result.getByRole('button', { name: 'Confirm', hidden: true }).closest('.modal-footer') as HTMLElement,
    ).getByRole('button', { name, hidden: true });

  it('explains that the request goes to a staff member for review', async () => {
    const { getByText } = await renderModal([queryMock([])]);

    expect(getByText(/Test Con uses signup moderation/)).toBeTruthy();
  });

  describe('conflicts with another signup', () => {
    it('warns that approval will withdraw them from an overlapping game', async () => {
      const { findByText } = await renderModal([queryMock([buildSignup()])]);

      expect(await findByText('Conflicting Game')).toBeTruthy();
      expect(await findByText(/automatically withdrawn from this conflicting event/)).toBeTruthy();
    });

    it.each([
      ['it does not overlap', buildSignup({ startsAt: '2026-06-05T20:30:00Z' })],
      ['it was withdrawn', buildSignup({ state: 'withdrawn' as MySignup['state'] })],
      ['either game can be played concurrently', buildSignup({ canPlayConcurrently: true })],
    ])('does not warn when %s', async (_description, signup) => {
      const { queryByText, getByText } = await renderModal([queryMock([signup])]);

      await waitFor(() => expect(getByText(/uses signup moderation/)).toBeTruthy());
      expect(queryByText(/automatically withdrawn/)).toBeNull();
    });
  });

  describe('confirming', () => {
    it('creates a signup request for the run and bucket, then closes', async () => {
      const result = await renderModal([queryMock([]), createRequestMock()]);

      await user.click(footerButton(result, 'Confirm'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(requested).toHaveBeenCalledWith({ targetRunId: '20', requestedBucketId: '1', replaceSignupId: undefined });
    });

    it('asks to replace the conflicting signup', async () => {
      const result = await renderModal([queryMock([buildSignup({ id: '90' })]), createRequestMock()]);

      await result.findByText(/automatically withdrawn/);
      await user.click(footerButton(result, 'Confirm'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(requested).toHaveBeenCalledWith({ targetRunId: '20', requestedBucketId: '1', replaceSignupId: '90' });
    });

    it('adds to the ranked-choice queue instead, when that is the option', async () => {
      const result = await renderModal([queryMock([]), createRankedChoiceMock()], {
        signupOption: signupOption({ action: 'ADD_TO_QUEUE' }),
      });

      await user.click(footerButton(result, 'Confirm'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(rankedChoiceRequested).toHaveBeenCalledWith({ targetRunId: '20', requestedBucketId: '1' });
      expect(requested).not.toHaveBeenCalled();
    });

    it('shows the error and stays open if the request fails', async () => {
      const result = await renderModal([
        queryMock([]),
        createRequestMock({ result: { errors: [{ message: 'You already have a pending request' }] } }),
      ]);

      await user.click(footerButton(result, 'Confirm'));

      expect(await result.findByText(/You already have a pending request/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
      expect(footerButton(result, 'Confirm')).toBeEnabled();
    });

    it('shows the error and stays open if adding to the queue fails', async () => {
      const result = await renderModal(
        [queryMock([]), createRankedChoiceMock({ result: { errors: [{ message: 'Queue is full' }] } })],
        { signupOption: signupOption({ action: 'ADD_TO_QUEUE' }) },
      );

      await user.click(footerButton(result, 'Confirm'));

      expect(await result.findByText(/Queue is full/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
    });

    it('shows an error rather than doing nothing if there is no signup option', async () => {
      const result = await renderModal([queryMock([])], { signupOption: undefined });

      await user.click(footerButton(result, 'Confirm'));

      expect(await result.findByText(/Signup option not found/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
    });

    it('disables both buttons while the request is in progress', async () => {
      const result = await renderModal([queryMock([]), createRequestMock({ delay: 100 })]);

      await user.click(footerButton(result, 'Confirm'));

      await waitFor(() => expect(footerButton(result, 'Confirm')).toBeDisabled());
      expect(footerButton(result, 'Cancel')).toBeDisabled();
      await waitFor(() => expect(close).toHaveBeenCalled());
    });
  });

  it('closes without requesting anything when cancelled', async () => {
    const result = await renderModal([queryMock([])]);

    await user.click(footerButton(result, 'Cancel'));

    expect(close).toHaveBeenCalledTimes(1);
    expect(requested).not.toHaveBeenCalled();
  });
});
