import { apolloClientContext } from 'AppContexts';
import { AcceptSignupRequestDocument } from '../../mutations.generated';
import { Route } from './+types/accept';

export async function action({ params: { id }, context }: Route.ActionArgs) {
  try {
    return await context.get(apolloClientContext).mutate({
      mutation: AcceptSignupRequestDocument,
      variables: { id },
    });
  } catch (error) {
    return error;
  }
}
