import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import {
  UserConProfileAdminQueryData,
  UserConProfileAdminQueryDocument,
  useUserConProfileAdminQuery,
} from './queries.generated';
import { useCreateTicketMutation } from './mutations.generated';

function useUserConProfileAdminQueryFromParams() {
  const userConProfileId = useParams<{ id: string }>().id;
  return useUserConProfileAdminQuery({ variables: { id: userConProfileId } });
}

export default LoadQueryWrapper(useUserConProfileAdminQueryFromParams, function NewTicket({ data }) {
  const userConProfileId = useParams<{ id: string }>().id;
  const history = useHistory();
  const [createTicket] = useCreateTicketMutation({
    update: (cache, result) => {
      const cacheData = cache.readQuery<UserConProfileAdminQueryData>({
        query: UserConProfileAdminQueryDocument,
        variables: { id: userConProfileId },
      });
      if (!cacheData) {
        return;
      }

      cache.writeQuery<UserConProfileAdminQueryData>({
        query: UserConProfileAdminQueryDocument,
        variables: { id: userConProfileId },
        data: {
          ...cacheData,
          convention: {
            ...cacheData.convention,
            user_con_profile: {
              ...cacheData.convention.user_con_profile,
              ticket: result.data?.createTicket?.ticket,
            },
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
    </>
  );
});
