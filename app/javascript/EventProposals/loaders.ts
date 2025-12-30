import { apolloClientContext } from '~/AppContexts';
import {
  EventProposalQueryWithOwnerDocument,
} from './queries.generated';
import { Route } from './+types/route_with_loader';

export const eventProposalWithOwnerLoader = async ({
  context,
  params: { id },
}: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: EventProposalQueryWithOwnerDocument,
    variables: { eventProposalId: id ?? '' },
  });
  return data;
};
