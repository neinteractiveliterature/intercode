import { apolloClientContext } from 'AppContexts';
import { RerunModeratedRankedChoiceSignupRoundDocument } from '../../mutations.generated';
import { Route } from './+types/rerun';

export async function action({ params: { id }, context }: Route.ActionArgs) {
  try {
    await context.get(apolloClientContext).mutate({
      mutation: RerunModeratedRankedChoiceSignupRoundDocument,
      variables: { id },
    });
    await context.get(apolloClientContext).resetStore();
    return null;
  } catch (error) {
    return error;
  }
}
