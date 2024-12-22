import { RerunModeratedRankedChoiceSignupRoundDocument } from '../../mutations.generated';
import { Route } from './+types/rerun';

export async function action({ params: { id }, context }: Route.ActionArgs) {
  try {
    await context.client.mutate({
      mutation: RerunModeratedRankedChoiceSignupRoundDocument,
      variables: { id },
    });
    await context.client.resetStore();
    return null;
  } catch (error) {
    return error;
  }
}
