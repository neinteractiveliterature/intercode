import { vi } from 'vitest';

import { render } from '../../testUtils';
import NextRoundInfoBox from '../../../../app/javascript/EventsApp/MySignupQueue/NextRoundInfoBox';
import { TicketMode } from '../../../../app/javascript/graphqlTypes.generated';
import { buildMySignupQueueData } from '../../fixtures/signupQueue';

type Round = { id: string; start: string | null; maximum_event_signups: string };

const round = (id: string, start: string | null, maximum: string): Round => ({
  id,
  start,
  maximum_event_signups: maximum,
});

describe('NextRoundInfoBox', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // Rounds start at 10am New York time (14:00 UTC) on Friday, Saturday and Sunday
  const rounds = [
    round('1', '2026-06-05T14:00:00Z', '2'),
    round('2', '2026-06-06T14:00:00Z', '4'),
    round('3', '2026-06-07T14:00:00Z', 'unlimited'),
  ];

  const renderBox = (
    now: string,
    {
      signupRounds = rounds,
      ticket = { allowsSignups: true } as { allowsSignups: boolean } | null,
      ticketMode = TicketMode.RequiredForSignup,
    }: { signupRounds?: Round[]; ticket?: { allowsSignups: boolean } | null; ticketMode?: TicketMode } = {},
  ) => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(now));

    const data = buildMySignupQueueData(
      {
        ticket: ticket
          ? {
              __typename: 'Ticket',
              id: '1',
              ticket_type: { __typename: 'TicketType', id: '1', allows_event_signups: ticket.allowsSignups },
            }
          : null,
      },
      {
        signup_rounds: signupRounds.map((signupRound) => ({ __typename: 'SignupRound', ...signupRound })),
        ticket_mode: ticketMode,
      },
    );

    return render(<NextRoundInfoBox data={data} />, {
      appRootContextValue: { timezoneName: 'America/New_York', ticketName: 'badge' },
    });
  };

  describe('which round it announces', () => {
    it('is the first round, before any has started', async () => {
      const { container } = await renderBox('2026-06-01T12:00:00Z');

      expect(container).toHaveTextContent('The next signup round starts at');
      expect(container).toHaveTextContent('Fri');
      expect(container).toHaveTextContent('10:00');
    });

    it('is the one after the current round', async () => {
      const { container } = await renderBox('2026-06-05T18:00:00Z');

      expect(container).toHaveTextContent('Sat');
    });

    it('is the last round while the one before it is on', async () => {
      const { container } = await renderBox('2026-06-06T18:00:00Z');

      expect(container).toHaveTextContent('Sun');
    });

    it('is nothing once the last round has started', async () => {
      const { container } = await renderBox('2026-06-07T18:00:00Z');

      expect(container).toBeEmptyDOMElement();
    });

    it('is nothing when there are no rounds', async () => {
      const { container } = await renderBox('2026-06-01T12:00:00Z', { signupRounds: [] });

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('what will happen in that round', () => {
    it('says players will be signed up until their schedule is full, for an unlimited round', async () => {
      const { container } = await renderBox('2026-06-06T18:00:00Z');

      expect(container).toHaveTextContent(
        'players will be signed up for events automatically based on their queue selections',
      );
    });

    it('says how many events, for a limited round', async () => {
      const { container } = await renderBox('2026-06-05T18:00:00Z');

      expect(container).toHaveTextContent('automatically signed up for events until they have a total of 4');
    });

    it('says one event, for a round limited to one', async () => {
      const { container } = await renderBox('2026-06-01T12:00:00Z', {
        signupRounds: [round('1', '2026-06-05T14:00:00Z', '1')],
      });

      expect(container).toHaveTextContent('automatically signed up for 1 event.');
    });

    it('says nothing about it for any other kind of round', async () => {
      const { container } = await renderBox('2026-06-01T12:00:00Z', {
        signupRounds: [round('1', '2026-06-05T14:00:00Z', 'not_yet')],
      });

      expect(container).toHaveTextContent('The next signup round starts at');
      expect(container).not.toHaveTextContent('At that time');
    });
  });

  describe('the person’s ticket', () => {
    it('is reassuring, in a plain alert, when they have one that allows signups', async () => {
      const { container, getByText } = await renderBox('2026-06-01T12:00:00Z');

      expect(getByText('You have a badge and will be signed up for events at that time.')).toBeTruthy();
      expect(container.querySelector('.alert-info')).toBeTruthy();
      expect(container.querySelector('.alert-warning')).toBeNull();
    });

    it('warns, with a link to buy one, when they have none', async () => {
      const { container, getByRole, getByText } = await renderBox('2026-06-01T12:00:00Z', { ticket: null });

      expect(getByText(/You do not have a badge/)).toBeTruthy();
      expect(container.querySelector('.alert-warning')).toBeTruthy();
      expect(getByRole('link', { name: /Buy a badge!/ })).toHaveAttribute('href', '/ticket/new');
    });

    it('warns, with no link to buy one, when theirs doesn’t allow signups', async () => {
      const { container, getByText, queryByRole } = await renderBox('2026-06-01T12:00:00Z', {
        ticket: { allowsSignups: false },
      });

      expect(getByText(/You have a badge that does not allow event signups/)).toBeTruthy();
      expect(container.querySelector('.alert-warning')).toBeTruthy();
      expect(queryByRole('link')).toBeNull();
    });

    it('is never a worry when the convention doesn’t use tickets', async () => {
      const { container, queryByText } = await renderBox('2026-06-01T12:00:00Z', {
        ticket: null,
        ticketMode: TicketMode.Disabled,
      });

      expect(queryByText(/You do not have a badge/)).toBeNull();
      expect(container.querySelector('.alert-info')).toBeTruthy();
    });
  });
});
