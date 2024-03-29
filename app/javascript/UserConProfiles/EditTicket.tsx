import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import { useUserConProfileAdminQuery } from './queries.generated';
import { useUpdateTicketMutation } from './mutations.generated';
import { TicketInput } from '../graphqlTypes.generated';

function useUserConProfileAdminQueryFromParams() {
  const userConProfileId = useParams<{ id: string }>().id;
  if (userConProfileId == null) {
    throw new Error('userConProfileId not found in params');
  }
  return useUserConProfileAdminQuery({ variables: { id: userConProfileId } });
}

export default LoadQueryWrapper(useUserConProfileAdminQueryFromParams, function EditTicket({ data }) {
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
});
