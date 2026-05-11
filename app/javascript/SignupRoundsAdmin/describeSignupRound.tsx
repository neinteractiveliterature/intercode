import { ParsedSignupRound } from '../SignupRoundUtils';
import { SignupRound } from '../graphqlTypes.generated';
import { TFunction } from 'i18next';

export function describeSignupRound(
  rounds: ParsedSignupRound<Pick<SignupRound, 'start' | 'maximum_event_signups'>>[],
  roundIndex: number,
  t: TFunction,
) {
  const round = rounds[roundIndex];

  if (round.timespan.start == null) {
    return t('signups.signupRounds.preSignupRoundPeriod');
  } else {
    if (rounds[0] && rounds[0].timespan.start == null) {
      return t('signups.signupRounds.roundNumber', { number: roundIndex });
    } else {
      return t('signups.signupRounds.roundNumber', { number: roundIndex + 1 });
    }
  }
}
