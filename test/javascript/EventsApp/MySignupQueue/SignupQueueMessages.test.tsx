import { render } from '../../testUtils';
import {
  PrioritizeWaitlistConfirmation,
  SkipReason,
} from '../../../../app/javascript/EventsApp/MySignupQueue/SignupQueueMessages';
import {
  RankedChoiceDecisionReason,
  RankedChoiceFallbackAction,
  SignupState,
} from '../../../../app/javascript/graphqlTypes.generated';
import {
  buildQueueConstraint,
  buildQueueProfile,
  buildQueueRankedChoice,
  buildQueueSignup,
  QueueProfile,
  QueueRankedChoice,
  QueueSignup,
} from '../../fixtures/signupQueue';

type SimulatedSkipReason = NonNullable<QueueRankedChoice['simulated_skip_reason']>;

const skip = (reason: RankedChoiceDecisionReason, extra: unknown = {}): SimulatedSkipReason => ({
  __typename: 'SimulatedSkipReason',
  reason,
  extra,
});

// A signup at some other run, for an event with the given title
const signupFor = (id: string, title: string, overrides: Partial<QueueSignup> = {}): QueueSignup =>
  buildQueueSignup({
    id,
    run: {
      __typename: 'Run',
      id: `run-${id}`,
      starts_at: '2026-06-06T20:00:00Z',
      ends_at: '2026-06-07T00:00:00Z',
      event: { __typename: 'Event', id: `event-${id}`, title },
    },
    ...overrides,
  });

describe('SkipReason', () => {
  const renderReason = (
    simulatedSkipReason: SimulatedSkipReason,
    {
      profile = buildQueueProfile(),
      pendingChoice = buildQueueRankedChoice(),
    }: { profile?: QueueProfile; pendingChoice?: QueueRankedChoice } = {},
  ) =>
    render(
      <SkipReason pendingChoice={pendingChoice} simulatedSkipReason={simulatedSkipReason} userConProfile={profile} />,
      {
        appRootContextValue: { timezoneName: 'America/New_York' },
      },
    );

  describe('a conflict', () => {
    it('says you’re already signed up when the only conflict is a confirmed signup for this very run', async () => {
      const choice = buildQueueRankedChoice();
      const profile = buildQueueProfile({
        signups: [signupFor('1', 'Murder Mystery', { run: { ...buildQueueSignup().run, id: choice.target_run.id } })],
      });

      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.Conflict, { conflicting_signup_ids: [1] }),
        {
          profile,
          pendingChoice: choice,
        },
      );

      expect(container).toHaveTextContent('Skip: You are already signed up');
    });

    it('says you’re already on the waitlist when it is a waitlisted signup for this run', async () => {
      const choice = buildQueueRankedChoice();
      const profile = buildQueueProfile({
        signups: [
          signupFor('1', 'Murder Mystery', {
            state: SignupState.Waitlisted,
            run: { ...buildQueueSignup().run, id: choice.target_run.id },
          }),
        ],
      });

      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.Conflict, { conflicting_signup_ids: ['1'] }),
        {
          profile,
          pendingChoice: choice,
        },
      );

      expect(container).toHaveTextContent('Skip: You are already on the waitlist');
    });

    it('names the events it conflicts with otherwise', async () => {
      const profile = buildQueueProfile({
        signups: [signupFor('1', 'Big Game'), signupFor('2', 'Other Game'), signupFor('3', 'Unrelated Game')],
      });

      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.Conflict, { conflicting_signup_ids: [1, 2] }),
        { profile },
      );

      expect(container).toHaveTextContent('Skip: Conflicts with Big Game and Other Game');
      expect(container).not.toHaveTextContent('Unrelated Game');
    });

    it('treats a single conflict with a different run as an ordinary conflict', async () => {
      const profile = buildQueueProfile({ signups: [signupFor('1', 'Big Game')] });

      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.Conflict, { conflicting_signup_ids: [1] }),
        {
          profile,
        },
      );

      expect(container).toHaveTextContent('Skip: Conflicts with Big Game');
    });
  });

  describe('the person’s own limits', () => {
    const profile = buildQueueProfile({
      ranked_choice_user_constraints: [
        buildQueueConstraint({ id: '1', start: null, finish: null }),
        buildQueueConstraint({ id: '2', start: '2026-06-06T10:00:00Z', finish: '2026-06-07T10:00:00Z' }),
        buildQueueConstraint({ id: '3', start: '2026-06-07T10:00:00Z', finish: '2026-06-08T10:00:00Z' }),
      ],
    });

    it('says the total limit was reached', async () => {
      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.RankedChoiceUserConstraints, { ranked_choice_user_constraint_ids: [1] }),
        { profile },
      );

      expect(container).toHaveTextContent('Skip: You set a limit for total signups, and that limit has been reached');
    });

    it('says which day’s limit was reached', async () => {
      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.RankedChoiceUserConstraints, { ranked_choice_user_constraint_ids: [2] }),
        { profile },
      );

      expect(container).toHaveTextContent('You set a limit for signups on Saturday, and that limit has been reached');
    });

    it('lists every limit that was reached', async () => {
      const { container } = await renderReason(
        skip(RankedChoiceDecisionReason.RankedChoiceUserConstraints, { ranked_choice_user_constraint_ids: [2, 3, 1] }),
        { profile },
      );

      // (in the order the person's limits are listed, not the order the ids came in)
      expect(container).toHaveTextContent(/total signups.*signups on Saturday.*signups on Sunday/);
    });
  });

  it('says how far down the waitlist you’d be when that’s over your cap', async () => {
    const { container } = await renderReason(
      skip(RankedChoiceDecisionReason.WaitlistPositionCapExceeded, { waitlist_position: 7, waitlist_position_cap: 3 }),
    );

    expect(container).toHaveTextContent(
      'Skip: Murder Mystery is full and you would be at waitlist position 7, which exceeds your cap of 3',
    );
  });

  describe('a full event', () => {
    const waitlistProfile = () =>
      buildQueueProfile({ ranked_choice_fallback_action: RankedChoiceFallbackAction.Waitlist });

    it('says you may be waitlisted, if you’d fall back to the waitlist', async () => {
      const { container } = await renderReason(skip(RankedChoiceDecisionReason.Full), { profile: waitlistProfile() });

      expect(container).toHaveTextContent(
        'Waitlist: Murder Mystery is full. If there are no other available options, you may be put on the waitlist for this event.',
      );
    });

    it('says you will be waitlisted, if you prioritised the waitlist', async () => {
      const { container } = await renderReason(skip(RankedChoiceDecisionReason.Full), {
        profile: waitlistProfile(),
        pendingChoice: buildQueueRankedChoice({ prioritize_waitlist: true }),
      });

      expect(container).toHaveTextContent('If this choice is processed, you will be put on the waitlist.');
    });

    it('includes your waitlist position cap, if you set one', async () => {
      const { container } = await renderReason(skip(RankedChoiceDecisionReason.Full), {
        profile: waitlistProfile(),
        pendingChoice: buildQueueRankedChoice({ prioritize_waitlist: true, waitlist_position_cap: 5 }),
      });

      expect(container).toHaveTextContent('and you would be at position 5 or lower, you will be put on the waitlist');
    });

    it('says it will be skipped, if you’ve opted not to be waitlisted', async () => {
      const { container } = await renderReason(skip(RankedChoiceDecisionReason.Full), {
        profile: buildQueueProfile({ ranked_choice_fallback_action: RankedChoiceFallbackAction.None }),
      });

      expect(container).toHaveTextContent(
        'Skip: Murder Mystery is full, and you have opted not to be put on waitlists',
      );
    });
  });

  it('shows nothing for a reason it doesn’t explain', async () => {
    const { container } = await renderReason(skip(RankedChoiceDecisionReason.MissingTicket));

    expect(container).toHaveTextContent('');
  });
});

describe('PrioritizeWaitlistConfirmation', () => {
  const profile = buildQueueProfile({
    signup_ranked_choices: [
      buildQueueRankedChoice({ id: '2', priority: 2 }),
      buildQueueRankedChoice({
        id: '1',
        priority: 1,
        target_run: {
          ...buildQueueRankedChoice().target_run,
          event: { ...buildQueueRankedChoice().target_run.event, title: 'First Choice' },
        },
      }),
    ],
  });

  const renderConfirmation = (index: number, prioritizeWaitlist: boolean, waitlistPositionCap: number | null = null) =>
    render(
      <PrioritizeWaitlistConfirmation
        index={index}
        prioritizeWaitlist={prioritizeWaitlist}
        waitlistPositionCap={waitlistPositionCap}
        userConProfile={profile}
      />,
    );

  it('says a prioritised choice will be waitlisted rather than moving on to the next choice', async () => {
    const { container } = await renderConfirmation(0, true);

    expect(container).toHaveTextContent(
      'If First Choice is full, we’ll put you on the waitlist for it rather than trying to sign you up for Murder Mystery.',
    );
  });

  it('includes the position cap', async () => {
    const { container } = await renderConfirmation(0, true, 4);

    expect(container).toHaveTextContent('and you’d be at position 4 or lower');
  });

  it('says a prioritised last choice will be waitlisted', async () => {
    const { container } = await renderConfirmation(1, true);

    expect(container).toHaveTextContent('If Murder Mystery is full, we’ll put you on the waitlist for it.');
    expect(container).not.toHaveTextContent('rather than');
  });

  it('says a prioritised last choice with a cap', async () => {
    const { container } = await renderConfirmation(1, true, 2);

    expect(container).toHaveTextContent('and you’d be at position 2 or lower, we’ll put you on the waitlist for it.');
  });

  it('says a choice that isn’t prioritised will move on to the next one when it’s full', async () => {
    const { container } = await renderConfirmation(0, false);

    expect(container).toHaveTextContent('If First Choice is full, we’ll try to sign you up for Murder Mystery.');
  });

  it('says a last choice that isn’t prioritised will be skipped when it’s full', async () => {
    const { container } = await renderConfirmation(1, false);

    expect(container).toHaveTextContent('If Murder Mystery is full, we’ll skip it.');
  });
});
