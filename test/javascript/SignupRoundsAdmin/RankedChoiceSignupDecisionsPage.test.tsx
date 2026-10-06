import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, waitFor } from '../testUtils';
import {
  Component as RankedChoiceSignupDecisionsPage,
  describeDecision,
  describeReason,
  loader,
} from '../../../app/javascript/SignupRoundsAdmin/RankedChoiceSignupDecisionsPage';
import {
  SignupRoundRankedChoiceDecisionsTableQueryData,
  SignupRoundRankedChoiceDecisionsTableQueryDocument,
  SignupRoundsAdminQueryData,
  SignupRoundsAdminQueryDocument,
} from '../../../app/javascript/SignupRoundsAdmin/queries.generated';
import { RankedChoiceDecisionReason, RankedChoiceDecisionValue } from '../../../app/javascript/graphqlTypes.generated';
import { getI18n } from 'react-i18next';

type Round = SignupRoundsAdminQueryData['convention']['signup_rounds'][number];
type Entry =
  SignupRoundRankedChoiceDecisionsTableQueryData['convention']['signup_round']['ranked_choice_decisions_paginated']['entries'][number];

const round = (id: string, start: string | null, overrides: Partial<Round> = {}): Round => ({
  __typename: 'SignupRound',
  id,
  start,
  maximum_event_signups: 'unlimited',
  automation_action: 'execute_ranked_choice' as Round['automation_action'],
  ranked_choice_order: null,
  rerandomize_lottery_numbers: false,
  executed_at: null,
  ...overrides,
});

const entry = (
  id: string,
  attendee: string,
  event: string,
  decision: RankedChoiceDecisionValue,
  reason: RankedChoiceDecisionReason | null = null,
): Entry => ({
  __typename: 'RankedChoiceDecision',
  id,
  created_at: '2026-06-05T12:00:00Z',
  decision,
  reason,
  user_con_profile: { __typename: 'UserConProfile', id: `u${id}`, name_without_nickname: attendee },
  target_run: {
    __typename: 'Run',
    id: `r${id}`,
    starts_at: '2026-06-06T18:00:00Z',
    title_suffix: null,
    event: { __typename: 'Event', id: `e${id}`, title: event },
  },
});

describe('describing decisions and reasons', () => {
  const t = getI18n().t.bind(getI18n());

  it.each([
    [RankedChoiceDecisionValue.Signup, 'sign up'],
    [RankedChoiceDecisionValue.Waitlist, 'waitlist'],
    [RankedChoiceDecisionValue.SkipChoice, 'skip choice'],
    [RankedChoiceDecisionValue.SkipUser, 'skip user'],
  ])('describes the decision %s as "%s"', (decision, description) => {
    expect(describeDecision(decision, t)).toBe(description);
  });

  it.each([
    [RankedChoiceDecisionReason.Conflict, 'conflict'],
    [RankedChoiceDecisionReason.Full, 'event full'],
    [RankedChoiceDecisionReason.MissingTicket, 'badge required'],
    [RankedChoiceDecisionReason.NoMoreSignupsAllowed, 'no more signups allowed'],
    [RankedChoiceDecisionReason.NoPendingChoices, 'no pending choices'],
    [RankedChoiceDecisionReason.RankedChoiceUserConstraints, 'user constraints'],
    [RankedChoiceDecisionReason.TeamMember, 'team member'],
    [RankedChoiceDecisionReason.WaitlistPositionCapExceeded, 'waitlist position cap exceeded'],
  ])('describes the reason %s as "%s"', (reason, description) => {
    expect(describeReason(reason, 'badge', t)).toBe(description);
  });

  it('gives every reason a different description', () => {
    const descriptions = Object.values(RankedChoiceDecisionReason).map((reason) => describeReason(reason, 'badge', t));

    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

describe('RankedChoiceSignupDecisionsPage', () => {
  const queried = vi.fn();
  let entries: Entry[];

  beforeEach(() => {
    queried.mockReset();
    entries = [
      entry('1', 'Alice Attendee', 'Big Game', RankedChoiceDecisionValue.Signup),
      entry('2', 'Bob Brown', 'Full Game', RankedChoiceDecisionValue.Waitlist, RankedChoiceDecisionReason.Full),
    ];
  });

  const rounds = () => [
    round('10', null, { maximum_event_signups: 'not_yet', automation_action: 'none' as Round['automation_action'] }),
    round('11', '2026-06-05T10:00:00Z', { executed_at: '2026-06-05T10:00:05Z' }),
    round('12', '2026-06-06T10:00:00Z'),
  ];

  const renderPage = (path = '/signup_rounds/11/results') => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: SignupRoundsAdminQueryDocument },
        result: {
          data: {
            __typename: 'Query',
            convention: { __typename: 'Convention', id: '1', signup_rounds: rounds() },
          } satisfies SignupRoundsAdminQueryData,
        },
        maxUsageCount: 5,
      },
      {
        request: {
          query: SignupRoundRankedChoiceDecisionsTableQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => ({
          data: {
            __typename: 'Query',
            convention: {
              __typename: 'Convention',
              id: '1',
              signup_round: {
                __typename: 'SignupRound',
                id: '11',
                ranked_choice_decisions_paginated: {
                  __typename: 'RankedChoiceDecisionsPagination',
                  total_pages: 1,
                  entries,
                },
              },
            },
          },
        }),
        maxUsageCount: 20,
      },
    ];

    return renderRoute([{ path: '/signup_rounds/:id/results', loader, Component: RankedChoiceSignupDecisionsPage }], {
      apolloMocks,
      initialEntries: [path],
      appRootContextValue: { timezoneName: 'UTC', ticketName: 'badge' },
    });
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];

  it('names the round, with when it runs', async () => {
    const r = await renderPage();

    expect(await r.findByRole('heading', { level: 1, name: /Round 1/ })).toBeTruthy();
    expect(r.getByRole('heading', { level: 1 }).textContent).toMatch(/2026/);
  });

  it('numbers rounds from the pre-signup period', async () => {
    const r = await renderPage('/signup_rounds/12/results');

    expect(await r.findByRole('heading', { level: 1, name: /Round 2/ })).toBeTruthy();
  });

  it('says when the automation ran, if it did', async () => {
    const executed = await renderPage();
    expect(await executed.findByText(/Automation ran/)).toBeTruthy();
    executed.unmount();

    const notExecuted = await renderPage('/signup_rounds/12/results');
    await notExecuted.findByRole('heading', { level: 1, name: /Round 2/ });
    expect(notExecuted.queryByText(/Automation ran/)).toBeNull();
  });

  it('is a 404 for a round that does not exist', async () => {
    const r = await renderPage('/signup_rounds/999/results');

    await waitFor(() => expect(r.queryByRole('heading', { level: 1 })).toBeNull());
    expect(queried).not.toHaveBeenCalled();
  });

  describe('the decisions table', () => {
    it('shows each decision with the attendee, the event, what was decided and why', async () => {
      const r = await renderPage();

      const aliceRow = (await r.findByText('Alice Attendee')).closest('tr') as HTMLElement;
      const bobRow = r.getByText('Bob Brown').closest('tr') as HTMLElement;
      const cellTexts = (row: HTMLElement) => Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent);
      expect(cellTexts(aliceRow).slice(0, 4)).toEqual(['Alice Attendee', 'Big Game', 'sign up', '']);
      expect(cellTexts(bobRow).slice(0, 4)).toEqual(['Bob Brown', 'Full Game', 'waitlist', 'event full']);
    });

    it('describes a missing-ticket reason with the convention’s word for tickets', async () => {
      entries = [
        entry(
          '3',
          'Cara Clark',
          'Some Game',
          RankedChoiceDecisionValue.SkipUser,
          RankedChoiceDecisionReason.MissingTicket,
        ),
      ];
      const r = await renderPage();

      expect(await r.findByText('badge required')).toBeTruthy();
    });

    it('asks for the round’s decisions, newest last, showing sign ups and waitlistings by default', async () => {
      const r = await renderPage();
      await r.findByText('Alice Attendee');

      expect(lastVariables()).toMatchObject({
        signupRoundId: '11',
        sort: [{ field: 'created_at', desc: false }],
        filters: { decision: ['SIGNUP', 'WAITLIST'] },
      });
    });

    it('takes filters from the URL, including reasons', async () => {
      const r = await renderPage('/signup_rounds/11/results?filters.decision=SKIP_USER&filters.reason=CONFLICT,FULL');
      await r.findByText('Alice Attendee');

      expect(lastVariables().filters).toMatchObject({ decision: ['SKIP_USER'], reason: ['CONFLICT', 'FULL'] });
    });

    it('offers a CSV export', async () => {
      const r = await renderPage();
      await r.findByText('Alice Attendee');

      expect(r.getByRole('button', { name: /Export/ })).toBeTruthy();
    });
  });
});
