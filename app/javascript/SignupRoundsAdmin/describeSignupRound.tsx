import { ParsedSignupRound } from '../SignupRoundUtils';
import { SignupRoundsAdminQueryData } from './queries.generated';
import { TFunction } from 'i18next';

export function describeSignupRound(
  rounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[],
  roundIndex: number,
  t: TFunction,
) {
  const round = rounds[roundIndex];

  if (round.timespan.start == null) {
    return t('signups.signupRounds.preSignupRoundPeriod', 'Pre-signups period');
  } else {
    if (rounds[0] && rounds[0].timespan.start == null) {
      return t('signups.signupRounds.roundNumber', { number: roundIndex });
    } else {
      return t('signups.signupRounds.roundNumber', { number: roundIndex + 1 });
    }
  }
}
