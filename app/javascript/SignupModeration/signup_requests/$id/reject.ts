import { apolloClientContext } from 'AppContexts';
import { RejectSignupRequestDocument } from '../../mutations.generated';
import { Route } from './+types/reject';

export async function action({ params: { id }, context }: Route.ActionArgs) {
  try {
    return await context.get(apolloClientContext).mutate({
      mutation: RejectSignupRequestDocument,
      variables: { id },
    });
  } catch (error) {
    return error;
  }
}
