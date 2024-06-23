import { useMemo } from 'react';
import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { SignupRankedChoiceState } from '../../graphqlTypes.generated';
import sortBy from 'lodash/sortBy';

export function usePendingChoices(userConProfile: UserConProfileRankedChoiceQueueFieldsFragment | undefined | null) {
  return useMemo(() => {
    if (userConProfile == null) {
      return [];
    }
    const pendingChoices = userConProfile.signup_ranked_choices.filter(
      (choice) => choice.state === SignupRankedChoiceState.Pending,
    );
    return sortBy(pendingChoices, (request) => request.priority);
  }, [userConProfile]);
}
