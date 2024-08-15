import { LoaderFunction } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import {
  EventProposalQueryWithOwnerDocument,
  EventProposalQueryWithOwnerQueryData,
  EventProposalQueryWithOwnerQueryVariables,
} from './queries.generated';

export const eventProposalWithOwnerLoader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>({
    query: EventProposalQueryWithOwnerDocument,
    variables: { eventProposalId: id ?? '' },
  });
  return data;
};
