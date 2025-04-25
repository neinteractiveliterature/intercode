import { TicketTypeInput } from 'graphqlTypes.generated';
import { Route } from './+types/edit';
import { UpdateTicketTypeDocument } from 'TicketTypeAdmin/mutations.generated';
import { redirect } from 'react-router';
import EditTicketTypeForm from 'TicketTypeAdmin/EditTicketType';
import { loader as routeLoader } from './route';
import { findById } from 'findById';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    const ticketType = (await request.json()) as TicketTypeInput;
    await context.get(apolloClientContext).mutate({
      mutation: UpdateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType, id },
      },
    });

    return redirect('..');
  } catch (error) {
    return error;
  }
}

export async function loader({ request, params: { id, eventId }, context }: Route.LoaderArgs) {
  const { ticketTypes } = await routeLoader({ params: { eventId }, request, context });
  return findById(ticketTypes, id ?? '');
}

export default function EditEventTicketType({ loaderData }: Route.ComponentProps) {
  return <EditTicketTypeForm initialTicketType={loaderData} />;
}
