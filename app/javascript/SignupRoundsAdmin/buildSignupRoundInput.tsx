import { ParsedSignupRound } from '../SignupRoundUtils';
import { SignupRoundInput } from '../graphqlTypes.generated';
import { SignupRoundsAdminQueryData } from './queries.generated';

export function buildSignupRoundInput(
  round: Pick<
    ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>,
    'maximum_event_signups' | 'ranked_choice_order' | 'timespan'
  >,
): SignupRoundInput {
  return {
    maximum_event_signups: round.maximum_event_signups?.toString(),
    ranked_choice_order: round.ranked_choice_order,
    start: round.timespan.start?.toISO(),
  };
}
