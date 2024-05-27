import sortBy from 'lodash/sortBy';
import Timespan from './Timespan';
import { SignupRound } from './graphqlTypes.generated';

export type MaximumEventSignupsValue = 'not_yet' | 'unlimited' | 'not_now' | number;

export function parseMaximumEventSignupsString(value: string | undefined): MaximumEventSignupsValue | undefined {
  if (value === 'not_yet' || value === 'not_now' || value === 'unlimited') {
    return value;
  }

  if (value == null) {
    return undefined;
  }

  const intValue = Number.parseInt(value);
  if (Number.isNaN(intValue)) {
    return undefined;
  }

  return intValue;
}

export type ParsedSignupRound<T extends Pick<SignupRound, 'start' | 'maximum_event_signups'>> = Omit<
  T,
  'start' | 'maximum_event_signups'
> & {
  timespan: Timespan;
  maximum_event_signups: MaximumEventSignupsValue | undefined;
};

export function parseSignupRounds<T extends Pick<SignupRound, 'start' | 'maximum_event_signups'>>(
  rounds: T[],
  timezoneName?: string,
): ParsedSignupRound<T>[] {
  const sortedRounds = sortBy(rounds, (round) => round.start ?? '0');
  return sortedRounds.map((round, index) => {
    const { start, maximum_event_signups, ...otherFields } = round;
    const nextRoundStart = index < sortedRounds.length - 1 ? sortedRounds[index + 1].start : undefined;
    const timespan = Timespan.fromStrings(start, nextRoundStart);
    const maximumEventSignups = parseMaximumEventSignupsString(maximum_event_signups);

    return {
      ...otherFields,
      maximum_event_signups: maximumEventSignups,
      timespan: timezoneName ? timespan.tz(timezoneName) : timespan,
    };
  });
}
