import { useCallback } from 'react';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import { UserConProfileAdminQueryData } from './queries.generated';
import { useUpdateTicketMutation } from './mutations.generated';
import { TicketInput } from '../graphqlTypes.generated';
import { NamedRoute } from '../AppRouter';

function EditTicket() {
  const data = useRouteLoaderData(NamedRoute.AdminUserConProfile) as UserConProfileAdminQueryData;
  const userConProfileId = useParams<{ id: string }>().id;
  const navigate = useNavigate();
  const [updateTicket] = useUpdateTicketMutation();

  const onSubmit = useCallback(
    async (ticketInput: TicketInput) => {
      if (!data.convention.user_con_profile.ticket) {
        throw new Error(`No ${data.convention.ticket_name} to update`);
      }
      await updateTicket({
        variables: {
          id: data.convention.user_con_profile.ticket.id,
          ticket: ticketInput,
        },
      });
      navigate(`/user_con_profiles/${userConProfileId}`);
    },
    [updateTicket, navigate, userConProfileId, data],
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
    </>
  );
}

export const Component = EditTicket;
