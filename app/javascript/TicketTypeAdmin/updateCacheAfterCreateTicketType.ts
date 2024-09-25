import { ApolloCache, MutationResult, Reference } from '@apollo/client';
import { CreateTicketTypeMutationData } from './mutations.generated';
import { TicketTypeAdmin_TicketTypeFieldsFragmentDoc } from './queries.generated';

export default function updateCacheAfterCreateTicketType(
  addRefToCache: (cache: ApolloCache<unknown>, ref: Reference | undefined) => void,
) {
  return (cache: ApolloCache<unknown>, result: MutationResult<CreateTicketTypeMutationData>) => {
    const ticketType = result.data?.createTicketType.ticket_type;
    if (ticketType) {
      const ref = cache.writeFragment({
        fragment: TicketTypeAdmin_TicketTypeFieldsFragmentDoc,
        fragmentName: 'TicketTypeAdmin_TicketTypeFields',
        data: ticketType,
      });
      addRefToCache(cache, ref);
    }
  };
}
