import { redirect } from 'react-router';
import { Route } from './+types/edit';
import { UpdateTicketTypeDocument } from './mutations.generated';
import EditTicketTypeForm from './EditTicketType';
import { findById } from 'findById';
import { loader as routeLoader } from './route';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    const ticketType = await request.json();
    await context.get(apolloClientContext).mutate({
      mutation: UpdateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType, id },
      },
    });

    return redirect('/ticket_types');
  } catch (error) {
    return error;
  }
}

export async function loader({ request, params: { id, eventId }, context }: Route.LoaderArgs) {
  const { ticketTypes } = await routeLoader({ params: { eventId }, request, context });
  return findById(ticketTypes, id ?? '');
}

export default function EditTicketTypeRoute({ loaderData }: Route.ComponentProps) {
  return <EditTicketTypeForm initialTicketType={loaderData} />;
}
