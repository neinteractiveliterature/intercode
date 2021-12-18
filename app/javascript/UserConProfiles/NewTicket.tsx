import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  if (userConProfileId == null) {
    throw new Error('userConProfileId not found in params');
  }
  return useUserConProfileAdminQuery({ variables: { id: userConProfileId } });
}

export default LoadQueryWrapper(useUserConProfileAdminQueryFromParams, function NewTicket({ data }) {
  const userConProfileId = useParams<{ id: string }>().id;
  const navigate = useNavigate();
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
      if (userConProfileId == null) {
        throw new Error('userConProfileId not found in params');
      }
      await createTicket({
        variables: {
          userConProfileId,
          ticket: ticketInput,
        },
      });
      navigate(`/user_con_profiles/${userConProfileId}`);
    },
    [createTicket, navigate, userConProfileId],
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
