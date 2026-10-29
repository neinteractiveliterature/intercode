import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { EventProposalQueryWithOwnerDocument } from './queries.generated';

export const eventProposalWithOwnerLoader = async ({ context, params: { id } }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: EventProposalQueryWithOwnerDocument,
    variables: { eventProposalId: id ?? '' },
    errorPolicy: 'none',
  });
  return data;
};
