import { Convention } from 'graphqlTypes.generated';
import { Route } from './+types/new';
import { CreateTicketTypeDocument } from './mutations.generated';
import updateCacheAfterCreateTicketType from './updateCacheAfterCreateTicketType';
import { replace } from 'react-router';
import { loader as routeLoader } from './route';
import NewTicketType from './NewTicketType';
import { apolloClientContext } from 'AppContexts';

export async function action({ context, request }: Route.ActionArgs) {
  try {
    const { ticketType, conventionId } = await request.json();
    await context.get(apolloClientContext).mutate({
      mutation: CreateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType },
      },
      update: updateCacheAfterCreateTicketType((cache, ref) => {
        cache.modify<Convention>({
          id: cache.identify({ __typename: 'Convention', id: conventionId }),
          fields: {
            ticket_types: (value) => [...value, ref],
          },
        });
      }),
    });

    return replace('/ticket_types');
  } catch (error) {
    return error;
  }
}

export const loader = routeLoader satisfies (args: Route.LoaderArgs) => unknown;

export default function NewTicketTypePage({ loaderData: { parent, ticketTypes } }: Route.ComponentProps) {
  return <NewTicketType parent={parent} ticketTypes={ticketTypes} />;
}
