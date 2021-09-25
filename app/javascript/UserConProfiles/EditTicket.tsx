import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import { useUserConProfileAdminQuery } from './queries.generated';
import { useUpdateTicketMutation } from './mutations.generated';

export default LoadQueryWrapper(useUserConProfileAdminQuery, function EditTicket({ data }) {
  const userConProfileId = Number.parseInt(useParams<{ id: string }>().id, 10);
  const history = useHistory();
  const [updateTicket] = useUpdateTicketMutation();

  const onSubmit = useCallback(
    async (ticketInput) => {
      if (!data.convention.user_con_profile.ticket) {
        throw new Error(`No ${data.convention.ticket_name} to update`);
      }
      await updateTicket({
        variables: {
          id: data.convention.user_con_profile.ticket.id,
          ticket: ticketInput,
        },
      });
      history.push(`/user_con_profiles/${userConProfileId}`);
    },
    [updateTicket, history, userConProfileId, data],
  );

  usePageTitle(
    `Editing ${data.convention.ticket_name} for ${data.convention.user_con_profile.name}`,
  );

  const { convention } = data;
  const userConProfile = convention.user_con_profile;

  if (!userConProfile.ticket) {
    return (
      <ErrorDisplay
        stringError={`${userConProfile.name} has no ${data.convention.ticket_name} to edit`}
      />
    );
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
