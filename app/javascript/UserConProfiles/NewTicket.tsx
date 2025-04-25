import { useCallback } from 'react';
import { redirect, useFetcher } from 'react-router';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import { UserConProfileAdminTicketFieldsFragmentDoc } from './queries.generated';
import { TicketInput } from '../graphqlTypes.generated';
import { CreateTicketDocument, CreateTicketMutationVariables } from './mutations.generated';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { ApolloError } from '@apollo/client';
import { Route } from './+types/NewTicket';
import { useUserConProfileLoaderData } from './userConProfileLoader';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const variables = (await request.json()) as CreateTicketMutationVariables;
    await context.get(apolloClientContext).mutate({
      mutation: CreateTicketDocument,
      variables,
      update: (cache, result) => {
        const ticket = result.data?.createTicket.ticket;
        if (ticket) {
          const ref = cache.writeFragment({
            fragment: UserConProfileAdminTicketFieldsFragmentDoc,
            fragmentName: 'UserConProfileAdminTicketFields',
            data: ticket,
          });
          cache.modify({
            id: cache.identify({ __typename: 'UserConProfile', id: variables.userConProfileId }),
            fields: {
              ticket: () => ref,
            },
          });
        }
      },
    });
    return redirect(`/user_con_profiles/${variables.userConProfileId}`);
  } catch (error) {
    return error;
  }
}

function NewTicket() {
  const data = useUserConProfileLoaderData();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;

  const onSubmit = useCallback(
    async (ticketInput: TicketInput) =>
      fetcher.submit(
        {
          userConProfileId: data.convention.user_con_profile.id,
          ticket: ticketInput,
        } satisfies CreateTicketMutationVariables,
        { method: 'POST', encType: 'application/json' },
      ),
    [fetcher, data.convention.user_con_profile.id],
  );

  usePageTitle(`New ${data.convention.ticket_name} for ${data.convention.user_con_profile.name}`);

  const { convention } = data;
  const userConProfile = convention.user_con_profile;

  return (
    <>
      <h1 className="mb-4">
        {'Create '}
        {convention.name} {convention.ticket_name}
        {' for '}
        {userConProfile.name}
      </h1>

      <TicketForm
        convention={convention}
        initialTicket={{
          ticket_type: undefined,
          provided_by_event: null,
        }}
        onSubmit={onSubmit}
        submitCaption={`Create ${convention.ticket_name}`}
        userConProfile={userConProfile}
      />

      <ErrorDisplay graphQLError={error as ApolloError | undefined} />
    </>
  );
}

export default NewTicket;
