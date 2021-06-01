import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import TicketForm from './TicketForm';
import { UserConProfileAdminQuery } from './queries';
import usePageTitle from '../usePageTitle';
import { UserConProfileAdminQueryData, useUserConProfileAdminQuery } from './queries.generated';
import { useCreateTicketMutation } from './mutations.generated';

export default LoadQueryWrapper(useUserConProfileAdminQuery, function NewTicket({ data }) {
  const userConProfileId = Number.parseInt(useParams<{ id: string }>().id, 10);
  const history = useHistory();
  const [createTicket] = useCreateTicketMutation({
    update: (cache, result) => {
      const cacheData = cache.readQuery<UserConProfileAdminQueryData>({
        query: UserConProfileAdminQuery,
        variables: { id: userConProfileId },
      });
      if (!cacheData) {
        return;
      }

      cache.writeQuery({
        query: UserConProfileAdminQuery,
        variables: { id: userConProfileId },
        data: {
          ...cacheData,
          userConProfile: {
            ...cacheData.userConProfile,
            ticket: result.data?.createTicket?.ticket,
          },
        },
      });
    },
  });

  const onSubmit = useCallback(
    async (ticketInput) => {
      await createTicket({
        variables: {
          userConProfileId,
          ticket: ticketInput,
        },
      });
      history.push(`/user_con_profiles/${userConProfileId}`);
    },
    [createTicket, history, userConProfileId],
  );

  usePageTitle(`New ${data.convention.ticket_name} for ${data.userConProfile.name}`);

  const { convention, userConProfile } = data;

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
    </>
  );
});
