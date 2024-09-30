import { useCallback } from 'react';
import { ActionFunction, redirect, useFetcher, useRouteLoaderData } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import { UserConProfileAdminQueryData } from './queries.generated';
import { TicketInput } from '../graphqlTypes.generated';
import { NamedRoute } from '../appRoutes';
import { client } from 'useIntercodeApolloClient';
import { UpdateTicketDocument } from './mutations.generated';
import { ApolloError } from '@apollo/client';

type ActionInput = {
  ticketId: string;
  ticketInput: TicketInput;
};

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    const { ticketId, ticketInput } = (await request.json()) as ActionInput;
    await client.mutate({
      mutation: UpdateTicketDocument,
      variables: { id: ticketId, ticket: ticketInput },
    });
    return redirect(`/user_con_profiles/${id}`);
  } catch (error) {
    return error;
  }
};

function EditTicket() {
  const data = useRouteLoaderData(NamedRoute.AdminUserConProfile) as UserConProfileAdminQueryData;
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;

  const onSubmit = useCallback(
    async (ticketInput: TicketInput) => {
      if (!data.convention.user_con_profile.ticket) {
        throw new Error(`No ${data.convention.ticket_name} to update`);
      }
      fetcher.submit({ ticketId: data.convention.user_con_profile.ticket.id, ticketInput } satisfies ActionInput, {
        method: 'PATCH',
        encType: 'application/json',
      });
    },
    [fetcher, data],
  );

  usePageTitle(`Editing ${data.convention.ticket_name} for ${data.convention.user_con_profile.name}`);

  const { convention } = data;
  const userConProfile = convention.user_con_profile;

  if (!userConProfile.ticket) {
    return <ErrorDisplay stringError={`${userConProfile.name} has no ${data.convention.ticket_name} to edit`} />;
  }

  return (
    <>
      <h1 className="mb-4">
        {'Edit '}
        {convention.name} {convention.ticket_name}
        {' for '}
        {userConProfile.name}
      </h1>

      <TicketForm
        convention={convention}
        initialTicket={userConProfile.ticket}
        onSubmit={onSubmit}
        submitCaption={`Save ${convention.ticket_name}`}
        userConProfile={userConProfile}
      />

      <ErrorDisplay graphQLError={error as ApolloError | undefined} />
    </>
  );
}

export const Component = EditTicket;
