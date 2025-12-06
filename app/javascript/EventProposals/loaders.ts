import { LoaderFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import {
  EventProposalQueryWithOwnerDocument,
  EventProposalQueryWithOwnerQueryData,
  EventProposalQueryWithOwnerQueryVariables,
} from './queries.generated';

export const eventProposalWithOwnerLoader: LoaderFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>({
    query: EventProposalQueryWithOwnerDocument,
    variables: { eventProposalId: id ?? '' },
  });
  return data;
};
