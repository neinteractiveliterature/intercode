import { ParsedSignupRound } from '../SignupRoundUtils';
import { RankedChoiceOrder, SignupRoundInput } from '../graphqlTypes.generated';
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

export function buildSignupRoundInputFromFormData(formData: FormData): SignupRoundInput {
  return {
    maximum_event_signups: formData.get('maximum_event_signups')?.toString(),
    ranked_choice_order: formData.get('ranked_choice_order')?.toString() as RankedChoiceOrder | undefined,
    start: formData.get('start')?.toString(),
  };
}
